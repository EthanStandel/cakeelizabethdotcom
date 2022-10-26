import React from "react";

import { XyzTransition } from "@animxyz/react";
import CommentIcon from "@fortawesome/fontawesome-free/svgs/solid/comment.svg";
import EnvelopeIcon from "@fortawesome/fontawesome-free/svgs/solid/envelope.svg";
import FileIcon from "@fortawesome/fontawesome-free/svgs/solid/file.svg";
import PaperPlaneIcon from "@fortawesome/fontawesome-free/svgs/solid/paper-plane.svg";
import PhoneIcon from "@fortawesome/fontawesome-free/svgs/solid/phone.svg";
import UserTagIcon from "@fortawesome/fontawesome-free/svgs/solid/user-tag.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled } from "@stitches/react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { Button } from "src/components/core/Button";
import { InputLabel } from "src/components/core/InputLabel";

import apiClient from "../clients/apiClient";
import InfoBox from "../components/InfoBox";
import { ContactForm } from "../models/ContactForm";
import styleUtils from "../utils/styleUtils";
import contactFormValidator from "../validation/contactFormValidator";

import { PhoneNumberInput } from "./PhoneNumberInput";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    name: string;
    email: string;
    phoneNumber: string;
    subject: string;
    message: string;
  }>({
    resolver: yupResolver(contactFormValidator.schema),
    mode: "onTouched",
  });

  return (
    <styleUtils.PageContainer>
      <styleUtils.ContentContainer>
        <styles.PageSplit>
          <div>
            <XyzTransition xyz="small-25% fade stagger">
              {latestSubmissionResult !== "success" && (
                <div>
                  <styles.Form
                    onSubmit={handleSubmit(async (form: ContactForm) => {
                      setSubmitting(true);
                      router.replace({ pathname: router.pathname });
                      const success = await apiClient.submitContactForm({
                        ...form,
                      });
                      router.replace({
                        pathname: router.pathname,
                        query: { submission: success ? "success" : "error" },
                      });
                      setSubmitting(false);
                    })}
                  >
                    <InputLabel
                      label={content.data.form.name}
                      required
                      error={!!errors.name}
                      icon={
                        <img
                          src={UserTagIcon.src}
                          alt={content.data.form.name}
                        />
                      }
                    >
                      <input {...register("name", { required: true })} />
                    </InputLabel>
                    <InputLabel
                      label={content.data.form.email}
                      required
                      error={!!errors.email}
                      icon={
                        <img
                          src={EnvelopeIcon.src}
                          alt={content.data.form.email}
                        />
                      }
                    >
                      <input {...register("email", { required: true })} />
                    </InputLabel>
                    <InputLabel
                      label={content.data.form.phoneNumber}
                      error={!!errors.phoneNumber}
                      icon={
                        <img
                          src={PhoneIcon.src}
                          alt={content.data.form.phoneNumber}
                        />
                      }
                    >
                      <PhoneNumberInput {...register("phoneNumber")} />
                    </InputLabel>
                    <InputLabel
                      label={content.data.form.subject}
                      error={!!errors.subject}
                      icon={
                        <img
                          src={CommentIcon.src}
                          alt={content.data.form.name}
                        />
                      }
                    >
                      <input {...register("subject")} />
                    </InputLabel>
                    <InputLabel
                      label={content.data.form.message}
                      required
                      error={!!errors.message}
                      icon={
                        <img
                          src={FileIcon.src}
                          alt={content.data.form.message}
                        />
                      }
                    >
                      <textarea
                        rows={3}
                        {...register("message", { required: true })}
                      />
                    </InputLabel>
                    <styles.Submit>
                      <Button loading={submitting} type="submit">
                        <img src={PaperPlaneIcon.src} alt="Submit" />
                        {content.data.form.send}
                      </Button>
                    </styles.Submit>
                  </styles.Form>
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "contact")!;
  return { props: { content } };
};

const styles = Object.freeze({
  Form: styled("form", {
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
