import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)<{ theme: "light" | "dark" }>`
  background: ${(props) => (props.theme === "dark" ? "#1e2939" : "#ffffff")};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) => (props.theme === "dark" ? "#1e2939" : "#000000")};
  border: ${(props) =>
    props.theme === "dark" ? "1px solid #373a40" : "1px solid #d1d5db"};
`;

const Header = styled.div`
  background: #1a1b1e;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #2c2e33;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const CircleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 4px;
`;

const Circle = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  opacity: 0.9;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const Content = styled.div<{ theme: "light" | "dark" }>`
  padding: 24px;
  flex: 1;
  overflow: auto;
  height: 100%;
  background: ${(props) => (props.theme === "dark" ? "#1e2939" : "#ffffff")};
`;

interface BrowserContainerProps {
  children: React.ReactNode;
  theme: "light" | "dark";
}

export const BrowserContainer = ({
  children,
  theme,
}: BrowserContainerProps) => {
  return (
    <Container
      theme={theme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Header>
        <CircleContainer>
          <Circle color="#FF5F57" />
          <Circle color="#FFBD2E" />
          <Circle color="#28C840" />
        </CircleContainer>
      </Header>
      <Content theme={theme}>{children}</Content>
    </Container>
  );
};
