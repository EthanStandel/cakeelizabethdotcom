import { useState } from "react";

import { XyzTransition } from "@animxyz/react";
import { Icon } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { GetStaticProps } from "next";
import Link from "next/link";
import {
  FaEnvelope,
  FaPhoneAlt,
  FaFileAlt,
  FaPaperPlane,
  FaUserTag,
} from "react-icons/fa";
import { MdChatBubble } from "react-icons/md";

import type content from "../../public/resources/pages/contact/content.json";
import apiClient from "../clients/apiClient";
import staticPageContentClientFactory from "../clients/staticPageContentClientFactory";
import CtaButton from "../components/CtaButton";
import InfoBox from "../components/InfoBox";
import Input from "../components/Input";
import { ContactForm } from "../models/ContactForm";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/contact.module.sass";
import contactFormValidator from "../validation/contactFormValidator";

type Content = typeof content;

const Page = (content: Content) => {
  const [submitting, setSubmitting] = useState(false);
  const [latestSubmissionResult, setLatestSubmissionResult] = useState<
    "success" | "error" | null
  >(null);

  return (
    <div className={appClasses.pageContainer}>
      <div className={appClasses.contentContainer}>
        <div className={classes.pageSplit}>
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
                    onSubmit={async (form: ContactForm) => {
                      setLatestSubmissionResult(null);
                      setSubmitting(true);
                      const success = await apiClient.submitContactForm(form);
                      setLatestSubmissionResult(success ? "success" : "error");
                      setSubmitting(false);
                    }}
                  >
                    <Form className={classes.form}>
                      <Input
                        name="name"
                        left={<Icon color="gray.300" as={FaUserTag} />}
                        label={content.form.name}
                        required
                      />
                      <Input
                        name="email"
                        left={<Icon color="gray.300" as={FaEnvelope} />}
                        label={content.form.email}
                        required
                      />
                      <Input
                        name="phoneNumber"
                        left={<Icon color="gray.300" as={FaPhoneAlt} />}
                        label={content.form.phoneNumber}
                      />
                      <Input
                        name="subject"
                        left={<Icon color="gray.300" as={MdChatBubble} />}
                        label={content.form.subject}
                      />
                      <Input
                        name="message"
                        left={<Icon color="gray.300" as={FaFileAlt} />}
                        label={content.form.message}
                        required
                        textarea
                      />
                      <div className={classes.submit}>
                        <CtaButton
                          loading={submitting}
                          leftIcon={<Icon as={FaPaperPlane} />}
                          type="submit"
                        >
                          {content.form.send}
                        </CtaButton>
                      </div>
                    </Form>
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
          <div className={classes.contactBlock}>
            <h2>{content.contact.name}</h2>
            <div>
              <p>{content.contact.address.street}</p>
              <p>{content.contact.address.cityState}</p>
              <p>{content.contact.address.zip}</p>
            </div>
            <div>
              <a href={`tel:${content.contact.phone.literal}`}>
                {content.contact.phone.display}
              </a>
            </div>
            <div>
              <Link href={content.contact.web.literal}>
                {content.contact.web.display}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubmissionStatusBox = ({
  content,
  submissionResult,
}: {
  content: Content;
  submissionResult: "success" | "error";
}) => (
  <InfoBox state={submissionResult}>
    <span
      className={appClasses.htmlRoot}
      dangerouslySetInnerHTML={{
        __html: content.formResult[submissionResult],
      }}
    />
  </InfoBox>
);

export const getStaticProps: GetStaticProps = async () => {
  const client = staticPageContentClientFactory("contact");
  const content = await client.getContent<Content>();

  return { props: { ...content } };
};

export default Page;
