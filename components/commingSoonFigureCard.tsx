// style
import styles from "@/styles/home.module.css";

import * as React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CardWithForm({ data }: { data: any }) {
  return (
    <div style={{ opacity: 0.5, position: "relative" }}>
      <Card className={`w-[350px] ${styles.card_container}`}>
        <CardHeader>
          <div
            className={`flex flex-col items-center mt-4 ${styles.img_container}`}
          >
            <img src={data.image} alt={`image of ${data.name}`} />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button disabled variant="destructive">
            Comming Soon...
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
