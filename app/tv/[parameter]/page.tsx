"use client";
import BrowseTmdb from "@/app/browse";
import ExploreTmdb from "@/app/explore";
import { useParams } from "next/navigation";

export default function BrowseMovies() {
  const params = useParams();
  const parameter = String(params.parameter);
  return parameter === "explore" ? (
    <ExploreTmdb media_type="tv" />
  ) : (
    <BrowseTmdb media_type="tv" parameter={parameter} />
  );
}
