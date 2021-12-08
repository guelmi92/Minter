import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 0%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  withdt: 300px;
  opacity: 0.9;
  @media (min-width: 767px) {
    flex-direction: column;
    width: 500px;
    opacity: 0.9;
    
  }
`;

export const StyledLogo = styled.img`
  width: 300px;
  @media (min-width: 767px) {
    width: 800px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px var(--secondary);
  background-color: var(--accent);
  border-radius: 10%;
  flex: 1;
  Flex-direction: center;
  width: 150px;
  Flex-direction: column;
 
  
  @media (min-width: 900px) {
    width: 10%;
    
  }
  @media (min-width: 1000px) {
    width: 10%;
    
  }
  transition: width 0.5s;
`;

export const StyledImg1 = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  flex: 1;
  Flex-direction: left;
  width: 150px;
  Flex-direction: column;
 
  
  @media (min-width: 900px) {
    width: 15%;
    
  }
  @media (min-width: 1000px) {
    width: 15%;
    
  }
  transition: width 0.5s;
`;


export const ResponsiveWrapper1 = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: left;
  withdt: 300px;
  opacity: 0.9;
  @media (min-width: 767px) {
    flex-direction: column;
    width: 700px;
    opacity: 0.9;
    
  }
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;


  

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [_mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    TOKEN_COUNT: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * _mintAmount);
    let totalGasLimit = String(gasLimit * _mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
     .mint(_mintAmount)
      .send({
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = _mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = _mintAmount + 1;
    if (newMintAmount > 15) {
      newMintAmount = 15;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  },[]);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.webp" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.webp"} />
        
        
        <s.SpacerSmall />

        <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/ex.gif"} />
            
          </s.Container>

          <s.SpacerSmall />


        <div>
<a href="https://twitter.com/PunksInu" rel="noreferrer" target="_blank">
<img title="Twitter" alt="Twitter" src="/config/images/Twitter_blue.webp" width="50" height="50" />
</a>
<a href="https://opensea.io/collection/dogeinupunks" rel="noreferrer" target="_blank">
<img title="Opensea" alt="Opensea" src="/config/images/Opensea_Blue.webp" width="50" height="50" />
</a>
 
      </div>

      <s.SpacerSmall />
      

      <s.Container flex={1} jc={"center"} ai={"center"}>
      <s.TextSubTitle
                  style={{ textAlign: "center",
                  fontSize: 20,
                  //fontWeight: "bold", 
                  color: "var(--test-color1)" }}
                >
                  DogeInu Punks is a 10000 NFT Collection living on the Ethereum blockchain 
        </s.TextSubTitle>
                
                <s.TextSubTitle
                  style={{ textAlign: "center",
                  fontSize: 20,
                  //fontWeight: "bold", 
                  color: "var(--test-color1)" }}
                >
                  Each dogeInu Punk NFT has been generated in 32x32 pixels and enlarged
        </s.TextSubTitle>
        <s.TextSubTitle
                  style={{ textAlign: "center",
                  fontSize: 20,
                  //fontWeight: "bold", 
                  color: "var(--test-color1)" }}
                  >
                  with a Polaroid frame to make it look more cute and fun.
                  </s.TextSubTitle>
                
      <s.TextSubTitle
                  style={{ textAlign: "center",
                  fontSize: 20,
                  //fontWeight: "bold", 
                  color: "var(--test-color2)" }}
                >
                  The Collection is inspired by the popular Crypto Punks.
        </s.TextSubTitle>
                <s.SpacerXSmall/>
                <s.TextSubTitle
                  style={{ textAlign: "center", fontSize: 20, color: "var(--test-color3)" }}
                >
                  We are not affiliated with Larva Labs. 
                  </s.TextSubTitle>
                <s.SpacerSmall />
                </s.Container>
        <s.SpacerSmall />
        
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
        <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {blockchain.account === "" ||
                blockchain.smartContract === null ? "" : `${data.tokenCount} / ${CONFIG.MAX_SUPPLY}` }
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink rel={"noreferrer"} target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <s.SpacerSmall />
            
              {Number(data.tokenCount) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Excluding gas fees.
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      Connect to Metamask
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {_mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        
        </ResponsiveWrapper>
        <s.SpacerSmall />


        <ResponsiveWrapper1 flex={1} style={{ padding: 24 }} test>
        <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--test-color4)",
              padding: 24,
              borderRadius: 24,
              border: "4px var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              FAQ
            </s.TextTitle>
            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "var(--test-color1)",
              }}
            >
              * PUBLIC MINT DATE ?
              
            </s.TextSubTitle>
            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                color: "var(--test-color3)",
              }}
            >
              Live now
              
            </s.TextSubTitle>
            <s.SpacerSmall />
            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "var(--test-color1)",
              }}
            >
              * HOW MANY DOGEINUPUNKS IN TOTAL ?
              
            </s.TextSubTitle>
            <s.SpacerSmall />
            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                color: "var(--test-color3)",
              }}
            >
              10,000 NFTs
              
            </s.TextSubTitle>
            <s.SpacerSmall />
            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "var(--test-color1)",
              }}
            >
              * MINT PRICE ?
              
            </s.TextSubTitle>
            <s.SpacerSmall />

            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                color: "var(--test-color3)",
              }}
            >
              0.05 ETH
              
            </s.TextSubTitle>
            <s.SpacerSmall />

            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "var(--test-color1)",
              }}
            >
              * BLOCKCHAIN ?
              
            </s.TextSubTitle>
            <s.SpacerSmall />
            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                color: "var(--test-color3)",
              }}
            >
              Ethereum
              
            </s.TextSubTitle>
            <s.SpacerSmall />

            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 30,
                color: "var(--test-color1)",
              }}
            >
              * HOW TO MINT ?
              
            </s.TextSubTitle>
            <s.SpacerSmall />

            <s.TextSubTitle
              style={{
                textAlign: "center",
                fontSize: 25,
                color: "var(--test-color3)",
              }}
            >
              Through this web page or directly by smartcontract
              
            </s.TextSubTitle>
            <s.SpacerSmall />
          
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        
        </ResponsiveWrapper1>

                  
          
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "50%" }}>
          <s.TextSubTitle
            style={{
              textAlign: "center",
              color: "var(--test-color2)",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextSubTitle>
          <s.SpacerSmall />
          <s.TextSubTitle
            style={{
              textAlign: "center",
              color: "var(--test-color1)",
            }}
          >
            Set the correct gas limit from Metamask to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextSubTitle>

          <s.SpacerMedium/>

        <s.Container flex={1} jc={"left"} ai={"left"}>
            <StyledImg1 alt={"example"} src={"/config/images/Me.webp"} />
            <s.TextSubTitle
                  style={{ textAlign: "left", color: "var(--secondary-text)" }}
                >
                  DogIx0 - Creator and NFT Enthusiast
                </s.TextSubTitle> 
          </s.Container>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
