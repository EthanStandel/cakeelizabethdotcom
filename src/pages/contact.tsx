import React, { useEffect, useRef, useState } from "react";

import CommentIcon from "@fortawesome/fontawesome-free/svgs/solid/comment.svg";
import EnvelopeIcon from "@fortawesome/fontawesome-free/svgs/solid/envelope.svg";
import FileIcon from "@fortawesome/fontawesome-free/svgs/solid/file.svg";
import PaperPlaneIcon from "@fortawesome/fontawesome-free/svgs/solid/paper-plane.svg";
import PhoneIcon from "@fortawesome/fontawesome-free/svgs/solid/phone.svg";
import UserTagIcon from "@fortawesome/fontawesome-free/svgs/solid/user-tag.svg";
import { yupResolver } from "@hookform/resolvers/yup";
import { styled, css } from "@stitches/react";
import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CSSTransition } from "react-transition-group";

import { Button } from "src/components/core/Button";
import { InputLabel } from "src/components/core/InputLabel";

import apiClient from "../clients/apiClient";
import InfoBox from "../components/InfoBox";
import { PhoneNumberInput } from "../components/PhoneNumberInput";
import { ContactForm } from "../models/ContactForm";
import styleUtils from "../utils/styleUtils";
import contactFormValidator from "../validation/contactFormValidator";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";

type Props = { content: PageContent };

const Page: NextPage<Props> = ({ content }) => {
  const router = useRouter();
  const formRef = useRef(null);
  const successBoxRef = useRef(null);
  const errorBoxRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [formGone, setFormGone] = useState(false);
  const latestSubmissionResult = router.query.submission as
    | "success"
    | "error"
    | undefined;

  useEffect(() => {
    if (latestSubmissionResult === "success") {
      const timeout = setTimeout(() => {
        setFormGone(true);
      }, 250);
      return () => clearTimeout(timeout);
    }
  }, [latestSubmissionResult]);

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
    // resolver: yupResolver(contactFormValidator.schema),
    mode: "onTouched",
  });

  return (
    <styleUtils.PageContainer>
      <styleUtils.ContentContainer>
        <styles.PageSplit>
          <div>
            <CSSTransition
              timeout={200}
              unmountOnExit
              in={latestSubmissionResult !== "success"}
              nodeRef={formRef}
              classNames="form"
            >
              <div ref={formRef} className={styles.transitionalRoot()}>
                <styles.Form
                  onSubmit={handleSubmit(async (form: ContactForm) => {
                    setSubmitting(true);
                    router.replace(
                      {
                        pathname: router.pathname,
                      },
                      undefined,
                      { shallow: true }
                    );
                    // const success = await apiClient.submitContactForm({
                    //   ...form,
                    // });
                    const success = await new Promise((resolve) =>
                      setTimeout(() => resolve(Math.random() > 0.5), 3000)
                    );
                    router.replace(
                      {
                        pathname: router.pathname,
                        query: { submission: success ? "success" : "error" },
                      },
                      undefined,
                      { shallow: true }
                    );
                    setSubmitting(false);
                  })}
                >
                  <InputLabel
                    label={content.data.form.name}
                    // required
                    error={!!errors.name}
                    icon={
                      <img src={UserTagIcon.src} alt={content.data.form.name} />
                    }
                  >
                    <input {...register("name", { required: false })} />
                  </InputLabel>
                  <InputLabel
                    label={content.data.form.email}
                    // required
                    error={!!errors.email}
                    icon={
                      <img
                        src={EnvelopeIcon.src}
                        alt={content.data.form.email}
                      />
                    }
                  >
                    <input {...register("email", { required: false })} />
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
                      <img src={CommentIcon.src} alt={content.data.form.name} />
                    }
                  >
                    <input {...register("subject")} />
                  </InputLabel>
                  <InputLabel
                    label={content.data.form.message}
                    // required
                    error={!!errors.message}
                    icon={
                      <img src={FileIcon.src} alt={content.data.form.message} />
                    }
                  >
                    <textarea
                      rows={3}
                      {...register("message", { required: false })}
                    />
                  </InputLabel>
                  <styles.Submit>
                    <Button loading={submitting} type="submit">
                      <img src={PaperPlaneIcon.src} alt="Submit" />
                      {content.data.form.send}
                    </Button>
                  </styles.Submit>
                </styles.Form>
                <CSSTransition
                  timeout={200}
                  unmountOnExit
                  in={latestSubmissionResult === "error"}
                  nodeRef={errorBoxRef}
                  classNames="form"
                >
                  <div ref={errorBoxRef} className={styles.transitionalRoot()}>
                    <SubmissionStatusBox
                      content={content}
                      submissionResult="error"
                    />
                  </div>
                </CSSTransition>
              </div>
            </CSSTransition>
            <CSSTransition
              nodeRef={successBoxRef}
              timeout={200}
              unmountOnExit
              in={latestSubmissionResult === "success" && formGone}
              classNames="form"
            >
              <div ref={successBoxRef} className={styles.transitionalRoot()}>
                <SubmissionStatusBox
                  content={content}
                  submissionResult="success"
                />
              </div>
            </CSSTransition>
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
  transitionalRoot: css({
    "&.form-enter": {
      opacity: 0,
      transform: "scale(.6)",
    },
    "&.form-enter-active": {
      opacity: 1,
      transform: "none",
      transition: "opacity .2s ease, transform .2s ease",
    },
    "&.form-exit": {
      opacity: 1,
      transform: "none",
    },
    "&.form-exit-active": {
      transition: "opacity .2s ease, transform .2s ease",
      transform: "scale(.6)",
      opacity: 0,
    },
  }),
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
    display: "flex",
    "> button": {
      [styleUtils.mobile]: {
        flexGrow: 1,
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
