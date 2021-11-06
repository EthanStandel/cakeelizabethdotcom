import classes from "../styles/components/Footer.module.sass";

interface Props {
  content: { label: string };
}

const Footer = ({ content }: Props) => (
  <>
    <div className={classes.root}>
      <p>{content.label}</p>
    </div>
    <div className={classes.shadowCover} />
    <div className={classes.shadowFooter} />
  </>
);

export default Footer;
