//import "./style.css";
import bs58 from "bs58";
import React, { useState } from "react";

import BlockDetailsCard from "./BlockDetailsCard";

export type Query = { searchValue?: string; searchType?: string };

//TODO: Change some names
//TODO: create onClick funcionality for liquidations

export default function SearchCard() {
  const [query, setQuery] = useState<Query>();

  function handleChange(event: any) {
    const { value } = event.target;
    console.log(value);
    setQuery({ searchValue: value });
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log(event.target);

    //TODO: add validation checks change names
    setQuery({ searchValue: query?.searchValue, searchType: "block" });
  }

  return (
    <>
    Enter a block to examine
      <form onSubmit={handleSubmit}>
        <label>
          <input
            className="input"
            type="text"
            value={query?.searchValue}
            onChange={handleChange}
          />
        </label>
        <input className="submit" type="submit" value="Submit" />
      </form>

      {query?.searchType === "block" && <BlockDetailsCard query={query}/>}
    </>
  );
}