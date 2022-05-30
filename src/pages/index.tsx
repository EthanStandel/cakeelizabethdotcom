import { css } from "@emotion/react";
import type { GetStaticProps, NextPage } from "next";

import ClickableCard from "../components/ClickableCard";
import QuoteCarousel from "../components/QuoteCarousel";
import styleUtils from "../utils/styleUtils";

import { allPageContents } from ".contentlayer/generated";
import type { PageContent } from ".contentlayer/generated/types";
interface Props {
  content: PageContent;
}

const Page: NextPage<Props> = ({ content }) => (
  <div>
    <div css={styles.bannerImageContainer}>
      <img alt={content.data.bannerAlt} src="/resources/other/banner.jpg" />
    </div>
    <div css={styleUtils.pageContainer}>
      <div css={styleUtils.contentContainer}>
        <div css={styleUtils.center}>
          <h2>{content.data.chooseYourOccasion}</h2>
        </div>
        <div css={styles.cakeTypeCards}>
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

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = allPageContents.find(({ page }) => page === "index")!;

  return { props: { content } };
};

const styles = Object.freeze({
  bannerImageContainer: css`
    min-width: 100%;
    img {
      height: 500px;
      width: 100%;
      object-fit: cover;
      ${styleUtils.mobile(
        css`
          height: 300px;
        `
      )}
    }
  `,
  cakeTypeCards: css`
    display: grid;
    gap: 2em;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    width: 100%;
  `,
  quote: css`
    height: 300px;
  `,
});

export default Page;
