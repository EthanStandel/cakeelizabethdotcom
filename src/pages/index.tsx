import type { NextPage } from "next";
import Image from "next/image";

import ClickableCard from "../components/ClickableCard";
import QuoteCarousel from "../components/QuoteCarousel";
import BannerImg from "../resources/pages/index/banner.jpg";
import content from "../resources/pages/index/content.json";
import appClasses from "../styles/pages/app.module.scss";
import classes from "../styles/pages/index.module.scss";
import getStaticPropsFactory from "../utils/getStaticPropsFactory";

interface Props {
  content: typeof content;
}

const Page: NextPage<Props> = ({ content }) => {
  return (
    <div>
      <div className={classes.bannerImageContainer}>
        <Image alt={content.bannerAlt} src={BannerImg} />
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

export const getStaticProps = getStaticPropsFactory(content, content.title);

export default Page;
