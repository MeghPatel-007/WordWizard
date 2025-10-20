import React, { useState } from "react";
import { getTextOperations } from "../data/textUtils";
import DialogBox from "./DialogBox";

const TextForm = (props) => {
  const [text, setText] = useState("");
  const [dialogBoxOpen, setDialogBoxOpen] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [grammarResults, setGrammarResults] = useState([]);
  const [loadingGrammar, setLoadingGrammar] = useState(false);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const textOperations = getTextOperations(
    text,
    setText,
    setDialogBoxOpen,
    props,
    setGrammarResults,
  setLoadingGrammar,
    { isBold, setIsBold, isItalic, setIsItalic, isUnderline, setIsUnderline }
  );

  const buttonStyle = {
    color: props.theme === 'light' ? 'black' : "white",
    backgroundImage: props.theme === 'light' ? 'linear-gradient(135deg, #faffa3 0%, #f0f0a8 100%)' : `${props.colorTheme}`,
    filter: props.theme === 'light' ? 'none' : 'brightness(140%)',
    fontWeight: props.theme === 'light' ? 400 : 300,
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.15)',
  }

  // Function to get top 3 words
  const getTopWords = (text) => {
    const words = text
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") // remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const freq = {};
    words.forEach((word) => {
      freq[word] = (freq[word] || 0) + 1;
    });

    const sortedWords = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sortedWords.slice(0, 3); // top 3
  };

  // Store top words in a variable to avoid redundant calls
  const topWords = getTopWords(text);

  return (
    <section
      data-aos="fade-up"
      className={`min-h-screen py-8 ${
        props.theme === "light" ? "text-gray-900" : "text-white"
      }`}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-6">{props.heading}</h1>
          <textarea
            className={`w-full p-4 rounded-lg border-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              props.theme === "light"
                ? "bg-white border-gray-300 text-gray-900"
                : "bg-gray-700 border-gray-500 text-white"
            }`}
            rows="10"
            value={text}
            onChange={handleChange}
            placeholder="Enter your text here..."
          ></textarea>
          {grammarResults.length > 0 && (
                   <div
                     className={`mt-4 p-4 rounded-lg ${
                       props.theme === "light" ? "bg-yellow-50" : "bg-gray-800"
                     }`}
                   >
                     <h3 className="font-semibold mb-2">Grammar Suggestions:</h3>
                     <ul className="list-disc list-inside space-y-1">
                       {grammarResults.map((issue, i) => (
                         <li key={i}>
                           <strong>
                             {text.slice(issue.offset, issue.offset + issue.length)}
                           </strong>{" "}
                           →{" "}
                           {issue.replacements.length > 0
                             ? issue.replacements[0].value
                             : "No suggestion"}{" "}
                           <span className="text-gray-500">({issue.message})</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}
        </div>

        {/* Text operation buttons */}
        <div className="flex flex-wrap gap-2 my-6">
        {textOperations.map((op, i) => (
          <button
            key={i}
            disabled={text.length === 0 || (op.label === "Check Grammar" && loadingGrammar)}
            onClick={op.func}
            style={buttonStyle}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              text.length === 0 ||
              (op.label === "Check Grammar" && loadingGrammar)
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 active:scale-95"
            }`}
          >
            {op.label === "Check Grammar" && loadingGrammar
              ? "Checking..."
              : op.label}
          </button>
        ))}
      </div>
      </div>

      <div className={`container mx-auto px-6 py-8 max-w-4xl rounded-2xl shadow-lg transition-all duration-300 ${
          props.theme === "light"
            ? "bg-yellow-100 text-gray-800"
            : "bg-gray-900 text-gray-100"
        }`}
      >
        
        {/* Header */}
        <h2 className={`text-3xl font-bold mb-6 text-center tracking-tight ${
            props.theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        >
          Summary of the Text
        </h2>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center">
            {/* Words */}
            <div
              className={`p-4 rounded-xl border shadow-sm transition-all duration-300 ${
                props.theme === "light"
                  ? "bg-gradient-to-r from-yellow-200 to-yellow-300 border-yellow-400"
                  : "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700"
              }`}
            >
              <p className={`text-sm font-medium ${
                  props.theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Words
              </p>
              <p className="text-2xl font-semibold">
                {text.split(/\s+/).filter((el) => el.length !== 0).length}
              </p>
            </div>

            {/* Characters */}
            <div className={`p-4 rounded-xl border shadow-sm transition-all duration-300 ${
                props.theme === "light"
                  ? "bg-gradient-to-r from-yellow-200 to-yellow-300 border-yellow-400"
                  : "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  props.theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Characters
              </p>
              <p className="text-2xl font-semibold">{text.length}</p>
            </div>

            {/* Reading Time */}
            <div className={`p-4 rounded-xl border shadow-sm transition-all duration-300 ${
                props.theme === "light"
                  ? "bg-gradient-to-r from-yellow-200 to-yellow-300 border-yellow-400"
                  : "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  props.theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Reading Time
              </p>
              <p className="text-2xl font-semibold">
                {(
                  0.008 * text.split(" ").filter((el) => el.length !== 0).length
                ).toFixed(2)}{" "}
                min
              </p>
            </div>
        </div>

        {/* Top Words */}
        {topWords.length > 0 && (
          <div className="mb-8 text-center">
            <h3 className={`text-xl font-semibold mb-2 ${
                props.theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              Top Words
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {topWords.slice(0, 5).map(([word, count], index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    props.theme === "light"
                      ? "bg-indigo-100 text-gray-800 border-gray-200"
                      : "bg-gray-700 text-gray-200 border-gray-600"
                  }`}
                >
                  {word} ({count})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <div
          className={`border-t mb-8 ${
            props.theme === "light" ? "border-yellow-500" : "border-gray-700"
          }`}
        ></div>

        {/* Preview Section */}
        <h2 className={`text-2xl font-bold mb-4 ${
            props.theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        >
          Preview of the Text
        </h2>
        <p className={`text-lg leading-relaxed whitespace-pre-wrap break-words rounded-xl p-5 transition-colors ${
            props.theme === "light"
              ? "bg-yellow-50 border border-yellow-400 text-gray-800"
              : "bg-gray-800 border border-gray-700 text-gray-100"
          }`}
          style={{
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
            textDecoration: isUnderline ? "underline" : "none",
          }}
        >
          {text.length > 0 ? text : "Nothing to preview!"}
        </p>
      </div>

      
      {dialogBoxOpen && (
        // DialogBox component to confirm text clearing
        <DialogBox
          question="Are you sure you want to clear the text?"
          setDialogBoxOpen={setDialogBoxOpen}
          setText={setText}
          showAlert={props.showAlert}
          theme={props.theme}
        />
      )}
    </section>
  );
};

export default TextForm;