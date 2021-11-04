import { Icon } from "@chakra-ui/react";
import { Form, Formik, FormikConfig } from "formik";
import { GetStaticProps } from "next";
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
import contentClient from "../clients/contentClient";
import CtaButton from "../components/CtaButton";
import Input from "../components/Input";
import appClasses from "../styles/pages/app.module.scss";
import classes from "../styles/pages/contact.module.scss";

type Content = typeof content;

interface FormValues {
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
}

const formProps: FormikConfig<FormValues> = {
  initialValues: {
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  },
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string(), // TODO - validate this
    subject: yup.string(),
    message: yup.string().required(),
  }),
  validateOnMount: true,
  onSubmit: (form) => alert(JSON.stringify(form, undefined, 2)),
};

const Page = (content: Content) => (
  <div className={appClasses.pageContainer}>
    <div className={appClasses.contentContainer}>
      <Formik {...formProps}>
        <Form className={classes.form}>
          <Input
            name="name"
            left={<Icon color="gray.300" as={FaUserTag} />}
            label={content.form.name}
            isRequired
          />
          <Input
            name="email"
            left={<Icon color="gray.300" as={FaEnvelope} />}
            label={content.form.email}
            isRequired
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
            isRequired
            textarea
          />
          <div className={classes.submit}>
            <CtaButton leftIcon={<Icon as={FaPaperPlane} />} type="submit">
              {content.form.send}
            </CtaButton>
          </div>
        </Form>
      </Formik>
    </div>
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const props = await contentClient.getContentForPage<Content>("contact");
  return { props };
};

export default Page;
