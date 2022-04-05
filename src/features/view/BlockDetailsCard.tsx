import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import React, { useEffect, useState } from "react";

import { Typography, Card } from "antd";
const { Title } = Typography;

export type Query = { searchValue?: string; searchType?: string };

export type Confirmations = number | "max";
export type Timestamp = number | "unavailable";

export type Liquidations = JSX.Element[];

var percentageValue: Number;

export default function BlockDetailsCard({ query }: { query: Query }) {
  const [liquidations, setLiquidations] = useState<Liquidations>();
  const [percentage, setPercentage] = useState<Number>();
  
  useEffect(() => {
    getData();
  }, []);

  //find the liquidations that occurred within a specified block.
async function FindLiquidation( block: number){
    let liquidations = [];
    const liquidationAccountKeys = [
        new PublicKey("3WzxeQvyqbqrUHEbopK85twqmPUz2DYnS1NJ7QyKUQfp"),
        new PublicKey("UTABCRXirrbpCNDogCoqEECtM3V44jXGCsK23ZepV3Z"),
        new PublicKey("EjUgEaPpKMg2nqex9obb46gZQ6Ar9mWSdVKbw9A6PyXA"),
        new PublicKey("8hZvLy1J9ZdS6XJcHYjq4C3FHKyyRZvNeS3HfwTUXp3J"),
        new PublicKey("92bxgwRA1MUpEc6zAtKkYkTeDzX6CWRuaZmMak3c8mhr"),
        new PublicKey("FL5hfnRESGz2TKkKyAbQGQPbwUHfA8LBBexfDubf9HFi"),
        new PublicKey("49mYvAcRHFYnHt3guRPsxecFqBAY8frkGSFuXRL3cqfC"),
        new PublicKey("9QqRewoWbePkSH919xXn826h67ea1EFAVXhTdiJArDnx"),
        new PublicKey("H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG"),
        new PublicKey("AdtRGGhmqvom3Jemp5YNrxd9q9unX36BZk1pujkkXijL"),
        new PublicKey("SysvarC1ock11111111111111111111111111111111"),
        new PublicKey("Gnt27xtC473ZT2Mw5u8wZ68Z3gULkSTb5DuxJy7eJotD"),
        new PublicKey("CZx29wKMUxaJDq6aLVQTdViPL754tTR64NAgQBUGxxHb"),
        new PublicKey("7RCz8wb6WXxUhAigok9ttgrVgDFFFbibcirECzWSBauM"),
        new PublicKey("55YceCDfyvdcPPozDiMeNp9TpwmL1hdoTEFw5BMNWbpf"),
        new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        new PublicKey("So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo"),
    ]
    
    const url = clusterApiUrl("mainnet-beta").replace("api", "explorer-api");
    const connection = new Connection(url, "finalized");

    //fetch data from selected block
    const fetched = await connection.getBlockSignatures(block);
    
    let msg;
    //loop thru fetched.signatures to get the messages in the block
    for (let i = 0; i < fetched.signatures.length; i++){
        try {
            msg = (await connection.getTransaction(fetched.signatures[i]))?.transaction.message;
        } catch (error) {
            console.log(error);
        }

        percentageValue = i/fetched.signatures.length*100;
        setPercentage(percentageValue);
        //compare msg accounts data to liquidation function accounts
        //accounts 10 and 13 change depending on the interaction
        if(msg?.accountKeys?.length == 17){
            let counter = 0;
            for (let accountKey of msg?.accountKeys ? msg.accountKeys : []){
                if(!accountKey.equals(liquidationAccountKeys[counter])){
                    if(!(counter == 10 || counter == 13 )
                        && (accountKey.equals(liquidationAccountKeys[10]) || accountKey.equals(liquidationAccountKeys[13]))){
                        break;
                    }
                }
                counter++;
            }
            if(counter == 17){
                liquidations.push(fetched?.signatures[i])
            }
        }
    }
    console.log(liquidations);
    return(liquidations);
}

  async function getData() {

    let liquidationsInBlock = await FindLiquidation(Number(query.searchValue))
    
    try {
        //pass liquidations to the view.
        const listLiquidations = liquidationsInBlock?.map((liquidation) => 
          <li>{liquidation}</li>
        );
        setLiquidations(listLiquidations);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card
      hoverable
      style={{
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Title level={3}>Liquidations</Title>
      Block Scan {percentage}% Complete
      <ul style={{fontSize: 14}}>{liquidations}</ul>
    </Card>
  );
}