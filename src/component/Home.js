import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const Home = () => {
  const { userId } = useParams();
  console.log(userId);
  const [userData, setUserData] = useState(null);
  const [editableAmount, setEditableAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const labels = Object.keys(userData?.data.amount || {});
  const data = {
    labels,
    datasets: [
      {
        label: "",
        data: labels.map((label) => userData?.data.amount[label] || 0),
        backgroundColor: "#F0C3F1",
        borderColor: "#FFFFFF",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`, // Add the rupees icon
        },
      },
    },
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://stg.dhunjam.in/account/admin/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEditableAmount(data.data.amount.category_6.toString());
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error during data fetching:", error);
    }
  };

  const handleInputChange = (e, category) => {
    const newValue = e.target.value;

    // Update the state with the new value
    setUserData((prevUserData) => ({
      ...prevUserData,
      data: {
        ...prevUserData.data,
        amount: {
          ...prevUserData.data.amount,
          [category]: newValue,
        },
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch(
        `https://stg.dhunjam.in/account/admin/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: {
              category_6: parseFloat(editableAmount),
              category_7: parseFloat(userData.data.amount.category_7),
              category_8: parseFloat(userData.data.amount.category_8),
              category_9: parseFloat(userData.data.amount.category_9),
              category_10: parseFloat(userData.data.amount.category_10),
            },
          }),
        }
      );

      if (response.ok) {
        fetchUserData();
        toast.dismiss();
        toast.success("Price updated successfully!");
      } else {
        console.error("Save failed");
      }
    } catch (error) {
      console.error("Error during save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isValidInput = () => {
    const category6 = parseFloat(editableAmount);

    return (
      category6 >= 99 &&
      userData.data.amount.category_7 >= 79 &&
      userData.data.amount.category_8 >= 59 &&
      userData.data.amount.category_9 >= 39 &&
      userData.data.amount.category_10 >= 19
    );
  };

  console.log(userData);

  return (
    <div className="flex items-start justify-center w-[600px] m-auto my-10">
      {userData ? (
        <div className="justify-center">
          <h2 className="font-bold text-4xl text-white">
            {userData.data.name}, {userData.data.location} on Dhun Jam
          </h2>
          <div className="flex flex-row justify-between mt-7">
            <p className="text-[#ffffff] w-72 text-start">
              Do you want to change your customers for requesting songs?
            </p>
            <div className="flex flex-row gap-3 px-20">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="yes"
                  name="radioOptions"
                  value="true"
                  checked={userData.data.charge_customers === true}
                />
                <label htmlFor="yes">Yes</label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="no"
                  name="radioOptions"
                  value="false"
                  checked={userData.data.charge_customers === false}
                />
                <label htmlFor="no">No</label>
              </div>
            </div>
          </div>

          {/* Custom song request amount */}
          {userData && userData.data.charge_customers === true && (
            <div className="flex flex-row justify-between items-center mt-4">
              <p className="text-white">Custom song request amount-</p>
              <div className="flex flex-row gap-3">
                <div className="flex items-center">
                  <input
                    className="border border-white w-full bg-black rounded-xl px-5 py-3 mb-2 mx-auto"
                    type="text"
                    placeholder="Amount"
                    value={editableAmount}
                    onChange={(e) => setEditableAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Regular song request amount */}
          {userData.data.charge_customers === true ? (
            <div className="flex flex-row justify-between items-center mt-4">
              <p className="text-white text-start w-full">
                Regular song request amounts, from high to low-{" "}
              </p>
              <div className="flex flex-row gap-1 justify-end">
                <input
                  className="border border-white w-1/6 bg-black rounded-xl px-3 py-2 text-sm"
                  type="text"
                  placeholder="Amount"
                  value={userData.data.amount.category_7}
                  onChange={(e) => handleInputChange(e, "category_7")}
                />
                <input
                  className="border border-white w-1/6 bg-black rounded-xl px-3 text-sm"
                  type="text"
                  placeholder="Amount"
                  value={userData.data.amount.category_8}
                  onChange={(e) => handleInputChange(e, "category_8")}
                />
                <input
                  className="border border-white w-1/6 bg-black rounded-xl px-3 text-sm"
                  type="text"
                  placeholder="Amount"
                  value={userData.data.amount.category_9}
                  onChange={(e) => handleInputChange(e, "category_9")}
                />
                <input
                  className="border border-white w-1/6 bg-black rounded-xl px-3 text-sm"
                  type="text"
                  placeholder="Amount"
                  value={userData.data.amount.category_10}
                  onChange={(e) => handleInputChange(e, "category_10")}
                />
              </div>
            </div>
          ) : null}

          {userData.data.charge_customers === true ? (
            // Bar Chart
            <Bar className="my-10" data={data} options={options} />
          ) : null}

          {/* Save Button */}
          {userData && userData.data.charge_customers === true && (
            <button
              type="button"
              className={`bg-[#6741D9] text-white w-full px-4 py-2 rounded-md ${
                isSaving || !isValidInput()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleSave}
              disabled={isSaving || !isValidInput()}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};
