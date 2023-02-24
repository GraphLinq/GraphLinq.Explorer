import React from "react";
import Otter from "./otter.png";

const Logo: React.FC = () => (
    <div className="loading">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx="50" cy="50" fill="none" stroke="#2334ff" stroke-width="3" r="16" stroke-dasharray="75.39822368615503 27.132741228718345">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
            </circle>
        </svg>
        <span>Loading...</span>
    </div>
);

export default React.memo(Logo);

