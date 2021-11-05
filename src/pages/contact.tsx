import { useState } from "react";

import { Icon } from "@chakra-ui/react";
import { Form, Formik, FormikConfig } from "formik";
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
import * as yup from "yup";

import type content from "../../public/resources/pages/contact/content.json";
import apiClient from "../clients/apiClient";
import staticContentClient from "../clients/staticContentClient";
import CtaButton from "../components/CtaButton";
import Input from "../components/Input";
import { ContactForm } from "../models/ContactForm";
import appClasses from "../styles/pages/app.module.scss";
import classes from "../styles/pages/contact.module.scss";
import contactFormValidator from "../validation/contactFormValidator";

type Content = typeof content;

const Page = (content: Content) => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className={appClasses.pageContainer}>
      <div className={appClasses.contentContainer}>
        <div className={classes.pageSplit}>
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
              setSubmitting(true);
              await apiClient.submitContactForm(form);
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

export const getStaticProps: GetStaticProps = async () => {
  const props = await staticContentClient.getContentForPage<Content>("contact");
  return { props };
};

export default Page;
