"use client"
import React from "react";
import Appointment from "./Appointment";

function App() {
  const handleDateSelect = (date: Date) => {
    console.log("Selected Date:", date.toDateString());
  };

  const handleTimeSelect = (time: { id: string; label: string }) => {
    console.log("Selected Time:", time);
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Book Appointment</h1>
      <Appointment onDateSelect={handleDateSelect} onTimeSelect={handleTimeSelect} />
    </div>
  );
}

export default App;
