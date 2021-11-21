import type { GetStaticProps, NextPage } from "next";

import ClickableCard from "../components/ClickableCard";
import QuoteCarousel from "../components/QuoteCarousel";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/index.module.sass";

import { allPageContents } from ".contentlayer/data";
import type { PageContent } from ".contentlayer/types";
interface Props {
  content: PageContent;
}

const Page: NextPage<Props> = ({ content }) => (
  <div>
    <div className={classes.bannerImageContainer}>
      <img alt={content.data.bannerAlt} src="/resources/other/banner.jpg" />
    </div>
    <div className={appClasses.pageContainer}>
      <div className={appClasses.contentContainer}>
        <div className={appClasses.center}>
          <h2>{content.data.chooseYourOccasion}</h2>
        </div>
        <div className={classes.cakeTypeCards}>
          {(
            content.data.cakeTypes as Array<{
              title: string;
              link: string;
              img: string;
            }>
          ).map(({ title, link, img }) => (
            <ClickableCard
              key={title}
              href={link}
              alt={title}
              image={img}
              cta={content.data.clickableCardCta}
              title={title}
            />
          ))}
        </div>
      </div>
    </div>
    <QuoteCarousel quotes={content.data.quotes} />
  </div>
);

export const getStaticProps: GetStaticProps = async () => {
  const content = allPageContents.find(({ page }) => page === "index");

  return { props: { content } };
};

export default Page;
