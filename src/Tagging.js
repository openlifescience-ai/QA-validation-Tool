import { useState, useEffect } from "react";
import "./App.css";
import { ProgressBar } from "react-loader-spinner";
import axios from "axios";

function App(props) {
  const { handle_logout, userProfileName } = props;
  const [qno, setQno] = useState(0);
  const [datads, setDatads] = useState(undefined);
  const [index, setIndex] = useState(0);
  const [qnindex, setQnindex] = useState(0);
  const [maxlen, setMaxlen] = useState(0);
  const [maxalen, setMaxalen] = useState(0);
  const [maxqnlen, setMaxqnlen] = useState(0);
  const [id, setId] = useState([]);
  const [selectedDs, setSelectedDs] = useState("select");
  const [showgetds, setShowgetds] = useState(false);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [nextKey, setNextKey] = useState("");
  const [isDataExhaust, setIsDataExhaust] = useState("");
  const [checkStatus, setCheckStatus] = useState(false);
  const [dslist, setDslist] = useState([]);

  const url = "<backend-url>"

  const createUser = async () => {
    let data = {
      data: { user_key: userProfileName },
    };
    await axios
      .post(`${url}/create_user`, data)
      .then(async (response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getFirstSample = async () => {
    setLoader(true);
    let data = {
      data: { dataset_name: selectedDs },
    };
    await axios
      .post(`${url}/get_first_sample`, data)
      .then(async (response) => {
        console.log(response.data);
        setNextKey(response.data["result"]["next_key"]);
        setDatads(response.data["result"]);
        setMaxqnlen(response.data["result"]["data"].length);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSample = async (key_id) => {
    setLoader(true);
    let data = {
      data: {
        dataset_name: selectedDs,
        key_id: key_id,
      },
    };
    await axios
      .post(`${url}/get_sample`, data)
      .then(async (response) => {
        console.log(response.data);
        setNextKey(response.data["result"]["next_key"]);
        setDatads(response.data["result"]);
        setMaxqnlen(response.data["result"]["data"].length);
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateResponse = async (result) => {
    setLoader(true);
    if (userProfileName == "" || userProfileName == undefined) {
      alert("user id is empty.kindly logout and login")
      console.log("user id is empty.kindly logout and login")
      setLoader(false)
    } else {
      console.log("user id : ", userProfileName)
      let data = {
        data: {
          user_key: userProfileName,
          dataset_name: selectedDs,
          response: result,
        },
      };
      await axios
        .post(`${url}/update_response`, data)
        .then(async (response) => {
          console.log(response.data);
          setLoader(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  const lastData = async () => {
    setLoader(true);

    let data = {
      data: {
        user_key: userProfileName,
        dataset_name: selectedDs,
      },
    };
    await axios
      .post(`${url}/last_data`, data)
      .then(async (response) => {
        console.log(response.data);
        setLoader(false);
        if (response.data["result"] == "-1") {
          await getFirstSample();
          await setQnindex(0);
        } else {
          let qn_index = await response.data["result"]["qnindex"];
          console.log(qn_index);
          if (qn_index) {
            qn_index =
              qn_index == "last" ? 0 : response.data["result"]["qnindex"] + 1;
            console.log(qn_index);
          } else {
            qn_index = 0;
            console.log(qn_index);
          }
          await setQnindex(qn_index);
          if (response.data["result"]["nextKey"] == "") {
            await getSample(response.data["result"]["context_id"]);
          } else {
            await getSample(response.data["result"]["nextKey"]);
          }
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getDs = async () => {
    if (selectedDs == "" || selectedDs == "select") {
      alert("Select Dataset...");
    } else {
      console.log("Success");
      setCheckStatus(true);
      await lastData();
    }
  };
  const checkUser = async () => {
    setLoader(true);
    let data = {
      data: { user_key: userProfileName },
    };
    await axios
      .post(`${url}/login_checkup`, data)
      .then(async (response) => {
        console.log(response.data);
        console.log(response.data['result']['datasets']);
        if (response.data["result"]["code"] == -1) {
          console.log("New User");
          await createUser();
          await setShowgetds(true);
          await setDslist(response.data['result']['datasets'])
        } else {
          console.log("Existing User");
          await setShowgetds(true);
          await setDslist(response.data['result']['datasets'])
        }
        setLoader(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    window.onbeforeunload = function () {
      handle_logout();
      return true;
    };
    // checkUser();
    // setQnindex(2000)
    // get_dataset_from_gc();
    return () => {
      window.onbeforeunload = null;
    };
  });
  return (
    <div className="App">
      {loader ? (
        <center>
          <p>Loading... please wait</p>
          <ProgressBar
            height="80"
            width="80"
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            visible={loader}
            wrapperClass="progress-bar-wrapper"
            borderColor="#F4442E"
            barColor="#51E5FF"
          />
        </center>
      ) : (
        <>
          <div className="container1">
            <div className="item">
              {checkStatus ? (
                <div>
                  <button
                    className="button-log"
                    style={{ marginRight: 20 }}
                    onClick={async () => {
                      let data = {
                        data: {
                          user_key: userProfileName,
                          dataset_name: selectedDs,
                        },
                      };
                      await axios
                        .post(
                          `${url}/check_stats`,
                          data
                        )
                        .then(async (response) => {
                          console.log(response.data);
                          alert(
                            `Total Tagged: ${response.data["result"]["total_tagged"] ? response.data["result"]["total_tagged"] : 0}  Correct: ${response.data["result"]["correct"] ? response.data["result"]["correct"] : 0}  Wrong: ${response.data["result"]["wrong"] ? response.data["result"]["wrong"] : 0}`
                          );
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    }}
                  >
                    Check Status
                  </button>
                  <button
                    className="button-log"
                    style={{}}
                    onClick={async () => {
                      await setQnindex(0);
                      await getSample(nextKey)
                    }}
                  >
                    Skip Para
                  </button>

                </div>
              ) : (
                <></>
              )}
            </div>
            <div className="item"></div>
            <div className="item navitem">
              <div
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  justifyContent: "flex-end",
                }}
              >
                {showgetds ? (
                  <>
                    <select
                      style={{ marginRight: 5 }}
                      name="cars"
                      id="cars"
                      defaultValue={selectedDs}
                      onChange={(e) => setSelectedDs(e.target.value)}
                    >
                      <option value="select">Select</option>
                      {
                        dslist.map((item, index) => <option key={index} value={item}>{item.toUpperCase()}</option>)
                      }
                      {/* <option value="cancer">Cancer</option>
                      <option value="heart">Heart</option>
                      <option value="medication">Medication</option>
                      <option value="obesity">Obesity</option>
                      <option value="smoke">Smoke</option> */}
                    </select>
                    <button style={{ marginRight: 20 }} onClick={getDs}>
                      Get Datasets
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div>
                <b>User : </b>
                {userProfileName}{" "}
              </div>
              <div>
                <button className="button-log" onClick={handle_logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {datads ? (
            <>
              {isDataExhaust == "dataset_exhausted" ? (
                <>
                  <h1>Congrats, All the Question are Completed</h1>
                </>
              ) : (
                <div className="container">
                  <div className="item"></div>
                  <div className="item">
                    <center>
                      <h1>Task Name : Question Answering</h1>
                    </center>
                  </div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item">
                    <p className="para">
                      <span>
                        {datads["context"].slice(
                          0,
                          datads["data"][qnindex]["start"]
                        )}
                      </span>
                      <span
                        style={{
                          color: "white",
                          backgroundColor: "rgb(134,10,10",
                        }}
                      >
                        {datads["context"].slice(
                          parseInt(datads["data"][qnindex]["start"]),
                          parseInt(datads["data"][qnindex]["end"])
                        )}
                      </span>
                      <span>
                        {datads["context"].slice(
                          parseInt(datads["data"][qnindex]["end"])
                        )}
                      </span>
                    </p>
                  </div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item">
                    <center>
                      <p style={{ fontSize: 17 }}>
                        <b>Total Articles :</b>{" "}
                        {datads["data"][qnindex]["total_paragraphs"]}{" "}
                        <b>Current Article No : </b>
                        {datads["data"][qnindex]["current_paragraph"]} {"  "}
                        <b>Total Questions : </b>
                        {maxqnlen} <b>Current Question No : </b> {qnindex + 1}
                      </p>
                    </center>
                  </div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item">
                    <p className="para">
                      <center>
                        <p>
                          <b>Question :</b>{" "}
                          {datads["data"][qnindex]["question"]}
                        </p>
                        <p>
                          <b>Answer :</b> {datads["data"][qnindex]["answer"]}
                        </p>
                      </center>
                    </p>
                  </div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item">
                    <center>
                      <button
                        className="button"
                        onClick={async () => {
                          console.log("Correct");
                          let currentdate = new Date();

                          if (maxqnlen == qnindex + 1) {
                            console.log(maxqnlen, qnindex);
                            let result = {
                              comment: comment,
                              context_id: datads["data"][qnindex]["context_id"],
                              label: "Correct",
                              question_id:
                                datads["data"][qnindex]["question_id"],
                              time: currentdate,
                              qnindex: "last",
                              nextKey: nextKey,
                            };

                            await updateResponse(result);
                            await setQnindex(0);
                            if (nextKey == "dataset_exhausted") {
                              console.log(
                                "--------------------dataset_exhausted---------------"
                              );
                              setIsDataExhaust(nextKey);
                            } else {
                              console.log("mextdjsdjsd", nextKey);
                              await getSample(nextKey);
                            }
                          } else {
                            let result = {
                              comment: comment,
                              context_id: datads["data"][qnindex]["context_id"],
                              label: "Correct",
                              question_id:
                                datads["data"][qnindex]["question_id"],
                              time: currentdate,
                              qnindex: qnindex,
                              nextKey: "",
                            };
                            console.log(maxqnlen, qnindex + 1);
                            await updateResponse(result);
                            await setQnindex(qnindex + 1);
                            await setComment("");
                          }
                          // setLoader(true);
                        }}
                      >
                        Correct
                      </button>
                      <button
                        className="button"
                        onClick={async () => {
                          console.log("Wrong");
                          let currentdate = new Date();

                          if (maxqnlen == qnindex + 1) {
                            console.log(maxqnlen, qnindex);
                            let result = {
                              comment: comment,
                              context_id: datads["data"][qnindex]["context_id"],
                              label: "Correct",
                              question_id:
                                datads["data"][qnindex]["question_id"],
                              time: currentdate,
                              qnindex: "last",
                              nextKey: nextKey,
                            };

                            await updateResponse(result);
                            await setQnindex(0);
                            await setComment("");
                            if (nextKey == "dataset_exhausted") {
                              console.log(
                                "--------------------dataset_exhausted---------------"
                              );
                            } else {
                              await getSample(nextKey);
                            }
                          } else {
                            let result = {
                              comment: comment,
                              context_id: datads["data"][qnindex]["context_id"],
                              label: "Wrong",
                              question_id:
                                datads["data"][qnindex]["question_id"],
                              time: currentdate,
                              qnindex: qnindex,
                              nextKey: "",
                            };
                            console.log(maxqnlen, qnindex + 1);
                            await updateResponse(result);
                            await setQnindex(qnindex + 1);
                            await setComment("");
                          }
                        }}
                      >
                        Wrong
                      </button>
                      {/* <button
                        className="button"
                        onClick={async () => {
                          console.log("No Idea");
                          let currentdate = new Date();
                          let result = {
                            comment: comment,
                            context_id: datads["data"][qnindex]["context_id"],
                            label: "No Idea",
                            question_id: datads["data"][qnindex]["question_id"],
                            time: currentdate,
                          };
                          if (maxqnlen == qnindex + 1) {
                            console.log(maxqnlen, qnindex);
                            if (nextKey == "dataset_exhausted") {
                              console.log(
                                "--------------------dataset_exhausted---------------"
                              );
                            } else {
                              await getSample(nextKey);
                            }
                            await updateResponse(result);
                            await setQnindex(0);
                            await setComment("");
                          } else {
                            console.log(maxqnlen, qnindex + 1);
                            await updateResponse(result);
                            await setQnindex(qnindex + 1);
                            await setComment("");
                          }
                        }}
                      >
                        No Idea
                      </button> */}
                    </center>
                  </div>
                  <div className="item"></div>
                  <div className="item"></div>
                  <div className="item">
                    <textarea
                      name="comments"
                      id="comments"
                      rows="6"
                      cols="80"
                      placeholder="Comments..."
                      value={comment}
                      style={{ marginBottom: 50 }}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <div className="item"></div>
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 20, paddingTop: 50 }}>
              Welcome,{" "}
              <span style={{ fontSize: 20, fontWeight: "bold" }}>
                {userProfileName}
              </span>
              <br />
              <br />
              <button className="button-log" onClick={checkUser}>
                Check
              </button>{" "}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
