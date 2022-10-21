import React from "react";

import { XyzTransition } from "@animxyz/react";
import { Icon } from "@chakra-ui/react";
import { styled } from "@stitches/react";
import { Form, Formik } from "formik";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFileAlt,
  FaPaperPlane,
  FaUserTag,
} from "react-icons/fa";
import { MdChatBubble } from "react-icons/md";
import { formatPhoneNumber } from "react-phone-number-input";

import apiClient from "../clients/apiClient";
import CtaButton from "../components/CtaButton";
import InfoBox from "../components/InfoBox";
import Input from "../components/Input";
import { ContactForm } from "../models/ContactForm";
import styleUtils from "../utils/styleUtils";
import contactFormValidator from "../validation/contactFormValidator";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: PageContent };

const Page: NextPage<Props> = ({ content }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const latestSubmissionResult = router.query.submission as
    | "success"
    | "error"
    | undefined;

  return (
    <styleUtils.PageContainer>
      <styleUtils.ContentContainer>
        <styles.PageSplit>
          <div>
            <XyzTransition xyz="small-25% fade stagger">
              {latestSubmissionResult !== "success" && (
                <div>
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      phoneNumber: "",
                      subject: "",
                      message: "",
                    }}
                    validationSchema={contactFormValidator.schema}
                    validateOnMount
                    onSubmit={async ({ phoneNumber, ...form }: ContactForm) => {
                      setSubmitting(true);
                      router.replace({ pathname: router.pathname });
                      const success = await apiClient.submitContactForm({
                        ...form,
                        phoneNumber: formatPhoneNumber(phoneNumber),
                      });
                      router.replace({
                        pathname: router.pathname,
                        query: { submission: success ? "success" : "error" },
                      });
                      setSubmitting(false);
                    }}
                  >
                    <styles.Form>
                      <Input
                        name="name"
                        left={<Icon color="gray.300" as={FaUserTag} />}
                        label={content.data.form.name}
                        required
                      />
                      <Input
                        name="email"
                        left={<Icon color="gray.300" as={FaEnvelope} />}
                        label={content.data.form.email}
                        required
                      />
                      <Input
                        name="phoneNumber"
                        left={<Icon color="gray.300" as={FaPhoneAlt} />}
                        label={content.data.form.phoneNumber}
                        phoneNumber
                        type="tel"
                      />
                      <Input
                        name="subject"
                        left={<Icon color="gray.300" as={MdChatBubble} />}
                        label={content.data.form.subject}
                      />
                      <Input
                        name="message"
                        left={<Icon color="gray.300" as={FaFileAlt} />}
                        label={content.data.form.message}
                        required
                        textarea
                      />
                      <styles.Submit>
                        <CtaButton
                          loading={submitting}
                          leftIcon={<Icon as={FaPaperPlane} />}
                          type="submit"
                        >
                          {content.data.form.send}
                        </CtaButton>
                      </styles.Submit>
                    </styles.Form>
                  </Formik>
                  <XyzTransition xyz="small-25% fade stagger">
                    {latestSubmissionResult === "error" && (
                      <div>
                        <SubmissionStatusBox
                          content={content}
                          submissionResult={latestSubmissionResult}
                        />
                      </div>
                    )}
                  </XyzTransition>
                </div>
              )}
              {latestSubmissionResult === "success" && (
                <div>
                  <SubmissionStatusBox
                    content={content}
                    submissionResult={latestSubmissionResult}
                  />
                </div>
              )}
            </XyzTransition>
          </div>
          <styles.ContactBlock>
            <h2>{content.data.contact.name}</h2>
            <div>
              <p>{content.data.contact.address.street}</p>
              <p>{content.data.contact.address.cityState}</p>
              <p>{content.data.contact.address.zip}</p>
            </div>
            <div>
              <a href={`tel:${content.data.contact.phone.literal}`}>
                {content.data.contact.phone.display}
              </a>
            </div>
            <div>
              <a href={`mailto:${content.data.contact.email}`}>
                {content.data.contact.email}
              </a>
            </div>
            <div>
              <Link href={content.data.contact.web.literal}>
                {content.data.contact.web.display}
              </Link>
            </div>
          </styles.ContactBlock>
        </styles.PageSplit>
      </styleUtils.ContentContainer>
    </styleUtils.PageContainer>
  );
};

const SubmissionStatusBox = ({
  content,
  submissionResult,
}: {
  content: PageContent;
  submissionResult: "success" | "error";
}) => (
  <InfoBox state={submissionResult}>
    <styleUtils.HtmlRoot
      dangerouslySetInnerHTML={{
        __html: content.data.formResult[submissionResult],
      }}
    />
  </InfoBox>
);

export const getStaticProps: GetStaticProps<Props> = async (arg) => {
  console.log(arg);
  const content = allPageContents.find(({ page }) => page === "contact")!;
  return { props: { content } };
};

const styles = Object.freeze({
  Form: styled(Form, {
    display: "flex",
    flexDirection: "column",
    gap: ".5em",

    "> *": {
      // I have no idea...
      zIndex: 0,
    },
  }),
  Submit: styled("div", {
    width: "100%",
    marginTop: "1em",
    "> button": {
      [styleUtils.mobile]: {
        width: "100%",
      },
    },
  }),
  PageSplit: styled("div", {
    width: "100%",
    display: "flex",
    gap: "2em",
    [styleUtils.desktop]: {
      "> :first-child": {
        width: "60%",
      },
    },
    [styleUtils.mobile]: {
      flexDirection: "column-reverse",
    },
  }),
  ContactBlock: styled("div", {
    "> :not(:first-child)": {
      marginBottom: "1em",
    },
  }),
});

export default Page;
