/* eslint-disable no-unused-vars */
import { Grid } from "@mui/material";
import Card from "./Card";
import React from "react";
import { Profile, Team } from "src/types";
import { motion } from "framer-motion";
import { TeamsAction } from "pages/teams";

const container = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { translateX: -100, opacity: 0 },
  visible: {
    translateX: 0,
    opacity: 1,
  },
};

const MotionGrid = motion(
  // eslint-disable-next-line react/display-name
  React.forwardRef((props, ref) => (
    // @ts-ignore
    <Grid ref={ref} {...props} />
  ))
);

export type TCardItem = Team;

export type TCardList = TCardItem[];

export type TOwner = Team["owner"];

type Props = {
  cardList: TCardList;
  onAction: (id: TCardItem["id"], type: TeamsAction) => void;
  user: Profile | null;
};

export default function CardList({ cardList, onAction, user }: Props) {
  return (
    <MotionGrid
      // @ts-ignore
      container
      spacing={2}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {cardList?.map((card, index) => (
        <MotionGrid
          // @ts-ignore
          item
          lg={3}
          xs={12}
          key={card.id}
          variants={item}
        >
          <Card cardItem={card} onAction={onAction} user={user} />
        </MotionGrid>
      ))}
    </MotionGrid>
  );
}
