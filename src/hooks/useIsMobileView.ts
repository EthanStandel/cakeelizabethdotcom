import { useMediaQuery } from "@chakra-ui/media-query";

const useIsMobileView = () => {
  const [isMobileView] = useMediaQuery("(max-width: 750px)");
  return isMobileView;
};

export default useIsMobileView;
