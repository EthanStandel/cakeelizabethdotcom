import type { GetStaticProps, NextPage } from "next";

import type content from "../../public/resources/pages/index/content.json";
import staticPageContentClientFactory from "../clients/staticPageContentClientFactory";
import ClickableCard from "../components/ClickableCard";
import QuoteCarousel from "../components/QuoteCarousel";
import appClasses from "../styles/pages/app.module.sass";
import classes from "../styles/pages/index.module.sass";

type Content = typeof content;
interface Props {
  content: Content;
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
  const client = staticPageContentClientFactory("index");
  const content = await client.getContent<Content>();

  return { props: { content, pageTitle: content.title } };
};

export default Page;
