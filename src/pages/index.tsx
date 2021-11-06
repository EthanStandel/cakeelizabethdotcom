import type { GetStaticProps, NextPage } from "next";

import type IndexContent from "../../public/resources/pages/index/content.json";
import staticContentClient from "../clients/staticContentClient";
import ClickableCard from "../components/ClickableCard";
import QuoteCarousel from "../components/QuoteCarousel";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/index.module.sass";

interface Props {
  content: typeof IndexContent;
}

const Page: NextPage<Props> = ({ content }) => {
  return (
    <div>
      <div className={classes.bannerImageContainer}>
        <img alt={content.bannerAlt} src="/resources/other/banner.jpg" />
      </div>
      <div className={appClasses.pageContainer}>
        <div className={appClasses.contentContainer}>
          <div className={appClasses.center}>
            <h2>{content.chooseYourOccasion}</h2>
          </div>
          <div className={classes.cakeTypeCards}>
            {content.cakeTypes.map(({ title, link, img }) => (
              <ClickableCard
                key={title}
                href={link}
                alt={title}
                image={img}
                cta={content.clickableCardCta}
                title={title}
              />
            ))}
          </div>
        </div>
      </div>
      <QuoteCarousel quotes={content.quotes} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const content = await staticContentClient.getContentForPage<
    typeof IndexContent
  >("index");

  return { props: { content, pageTitle: content.title } };
};

export default Page;
