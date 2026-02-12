"use client";
import BrowseTmdb from "@/app/browse";
import ExploreTmdb from "@/app/explore";
import { useParams } from "next/navigation";

export default function BrowseMovies() {
  const params = useParams();
  const parameter = String(params.parameter);
  return parameter === "explore" ? (
    <ExploreTmdb media_type="movie" />
  ) : (
    <BrowseTmdb media_type="movie" parameter={parameter} />
  );
}
