import React, { useState, useEffect, useMemo, useRef } from "react";
import { generate } from "random-words";
import useTypingGame from "react-typing-game-hook";
import { FiRefreshCcw } from "react-icons/fi";

const generateRandomWords = function () {
  return generate(1000).join(" ");
};

const HomePage = () => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef(null);
  const textDivRef = useRef(null);
  const totalWidth = useRef(0);
  const [load, setLoad] = useState(false);
  const iconRef = useRef();
  const handleChange = (e) => {
    const newText = e.target.value;
    setInputText(newText);
  };
  const text = useMemo(() => generateRandomWords(), [load]);

  let maxWidth = 0;
  useEffect(() => {
    maxWidth = textDivRef.current.offsetWidth - 35;
    textDivRef.current.focus();
  });

  const handleReset = function () {
    iconRef.current.classList.add("rotate-animation");
    setLoad((prev) => !prev);
    setInputText("");
    totalWidth.current = 0;
    setTimeout(() => {
      iconRef.current.classList.remove("rotate-animation");
    }, 1000);
  };

  const {
    states: {
      charsState,
      length,
      currIndex,
      currChar,
      correctChar,
      errorChar,
      phase,
      startTime,
      endTime,
    },
    actions: { insertTyping, resetTyping, deleteTyping },
  } = useTypingGame(text);

  const handleKey = (key) => {
    if (key === "Escape") {
      resetTyping();
      setInputText("");
      totalWidth.current = 0;
    } else if (key === "Backspace") {
      deleteTyping(false);
      setInputText(inputText.slice(0, -1));
      if (currIndex >= 0) {
        const charElement = textDivRef.current.children[currIndex];
        if (charElement) {
          totalWidth.current -= charElement.offsetWidth;
        }
      }
    } else if (key === " ") {
      insertTyping(key);
      setInputText("");
    } else if (key.length === 1) {
      insertTyping(key);
      setInputText(inputText + key);
    }
  };

  useEffect(() => {
    if (currIndex >= 0) {
      const charElement = textDivRef.current.children[currIndex];
      if (charElement) {
        totalWidth.current += charElement.offsetWidth;
        if (
          (totalWidth.current >= maxWidth ||
            charElement.getBoundingClientRect().right >=
              textDivRef.current.getBoundingClientRect().right - 40) &&
          (currChar === " " || currIndex === text.length - 1)
        ) {
          const elements = document.querySelectorAll(".typed");
          elements.forEach((element) => {
            element.classList.add("scroll-out");
          });
          setTimeout(() => {
            elements.forEach((element) => element.remove());
          }, 500);

          totalWidth.current = 0;
        }
      }
    }
  }, [currIndex, currChar, text.length]);

  return (
    <>
      <div>
        <div className="bg-secondary-back w-[80%] ml-auto mr-auto mt-10 h-[130px] overflow-hidden rounded-md typing-test outline-none pt-1 pb-1 text-left pl-3 pr-3">
          <div
            className="pl-2 mt-1 rounded-md pr-2 pt-4 overflow-hidden typing-test outline-none"
            ref={textDivRef}
            onKeyDown={(e) => {
              handleKey(e.key);
              e.preventDefault();
            }}
            tabIndex={0}
          >
            {text.split("").map((char, index) => {
              let state = charsState[index];
              let color =
                state === 0 ? "white" : state === 1 ? "#81ff61" : "#ff6666";
              let className = `${currIndex > index ? "typed" : ""} ${
                currIndex === index ? "curr-letter" : ""
              }`;
              return (
                <span
                  key={char + index}
                  style={{ color }}
                  className={className}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
        <div className="w-[80%] flex gap-2 ml-auto mr-auto mt-4">
          <input
            type="text"
            name=""
            id=""
            className="mr-[12px] text-white h-[60px] w-[60%] bg-secondary-back focus:outline-none focus:ring-2 ring-[#1585e0] ring-2  rounded-md mb-2 text-[21px] p-4"
            ref={inputRef}
            value={inputText}
            onChange={handleChange}
          />
          <div className="h-[60px] bg-secondary-back p-5 mr-[12px] rounded-md w-[120px] text-lg flex justify-center items-center">
            <span>WPM</span>
          </div>
          <div className="h-[60px] w-[120px] bg-secondary-back p-5 rounded-md text-lg mr-[12px] flex justify-center items-center">
            <span>Timer</span>
          </div>
          <button
           
            className="h-[60px] w-[85px] bg-secondary-back rounded-md hover:bg-secondary-blue flex justify-center items-center"
            onClick={handleReset}
          >
            <span  ref={iconRef}>
              <FiRefreshCcw size={30} />
            </span>
          </button>
        </div>
      </div>
      <pre>
        {JSON.stringify(
          {
            startTime,
            endTime,
            length,
            currIndex,
            currChar,
            correctChar,
            errorChar,
            phase,
          },
          null,
          2
        )}
      </pre>
    </>
  );
};

export default HomePage;
