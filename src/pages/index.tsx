import styled from "@emotion/styled";
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
    <styles.BannerImageContainer>
      <img alt={content.data.bannerAlt} src="/resources/other/banner.jpg" />
    </styles.BannerImageContainer>
    <div css={styleUtils.pageContainer}>
      <div css={styleUtils.contentContainer}>
        <div css={styleUtils.center}>
          <h2>{content.data.chooseYourOccasion}</h2>
        </div>
        <styles.CakeTypeCards>
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
        </styles.CakeTypeCards>
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
  BannerImageContainer: styled.div({
    minWidth: "100%",
    img: {
      height: 500,
      width: "100%",
      objectFit: "cover",
      [styleUtils.mobile]: {
        height: 300,
      },
    },
  }),
  CakeTypeCards: styled.div({
    display: "grid",
    gap: "2em",
    justifyItems: "center",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  }),
});

export default Page;
