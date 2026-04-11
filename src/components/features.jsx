import React from "react";
import "./features.css"; // CSS file for styling

export const Features = (props) => {
  // Example rank data
  const rankData = [
    { name: "RANK_1", reward: "Silver", rewardAmount: 0 },
    { name: "RANK_2", reward: "Gold", rewardAmount: 5000 },
    { name: "RANK_3", reward: "Diamond", rewardAmount: 10000 },
    { name: "RANK_4", reward: "Blue Diamond", rewardAmount: 20000 },
    { name: "RANK_5", reward: "Ambassador", rewardAmount: 40000 },
    { name: "RANK_6", reward: "Blue Ambassador", rewardAmount: 60000 },
    { name: "RANK_7", reward: "Topaz", rewardAmount: 80000 },
    { name: "RANK_8", reward: "Blue Topaz", rewardAmount: 100000 },
    { name: "RANK_9", reward: "Ambassador Elite", rewardAmount: 200000 },
  ];

  // Icon object (can also import from separate file)
  const rewardIcons = {
    Silver: "🥈",
    Gold: "🥇",
    Diamond: "💎",
    "Blue Diamond": "🔷",
    Ambassador: "🌟",
    "Blue Ambassador": "🔹",
    Topaz: "🟠",
    "Blue Topaz": "🔵",
    "Ambassador Elite": "🏆",
  };

  return (
    <>
      <div id="features" className="text-center" style={{ paddingBottom: "20px" }}>
        <div className="container">
          <div className="col-md-10 col-md-offset-1 section-title">
            <h2>Features</h2>
          </div>
          <div className="row">
            {props.data
              ? props.data.map((d, i) => (
                  <div key={`${d.title}-${i}`} className="col-xs-6 col-md-3 feature-box">
                    <i className={d.icon}></i>
                    <h3>{d.title}</h3>
                    <p>{d.text}</p>
                  </div>
                ))
              : "Loading..."}
          </div>
        </div>
      </div>

      {/* Rank Cards Section */}
      <div className="rank-bg-container">
        <h2>Our Ranks & Rewards</h2>
        <div className="rank-cards">
          {rankData.map((rank, i) => (
            <div key={i} className="rank-card">
              <h3>{rank.name}</h3>
              {rank.reward ? (
                <>
                  <p className="reward">
                    {rewardIcons[rank.reward]} {rank.reward}
                  </p>
                  <p className="amount">${rank.rewardAmount.toLocaleString()}</p>
                </>
              ) : (
                <p className="reward">No Reward</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};