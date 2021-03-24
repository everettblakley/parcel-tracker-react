import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useQueryParams } from "../../hooks";
import { useStore } from "../../stores/store.context";
import classnames from "classnames";
import "./Form.scss";

export const Form = observer(function Form() {
  // Hooks
  const history = useHistory();
  const queryParams = useQueryParams();
  const location = useLocation();
  const store = useStore();
  const trackingNumberParam = queryParams.get("trackingNumber");
  // State
  const [trackingNumber, setTrackingNumber] = useState(
    trackingNumberParam || ""
  );
  const [isDanger, setIsDanger] = useState("");
  const [clearOrSubmit, setClearOrSubmit] = useState<"Clear" | "Submit">(
    "Submit"
  );

  // Effects
  useEffect(() => {
    if (trackingNumberParam && location.pathname === "/") {
      setTrackingNumber(trackingNumberParam);
    }
  }, [trackingNumberParam, location]);

  useEffect(() => {
    if (!!store.errorMessage) {
      setIsDanger("is-danger");
    } else {
      setIsDanger("");
    }
  }, [store.errorMessage]);

  useEffect(() => {
    if (store.parcelData.length > 0) {
      if (store.trackingNumber === trackingNumber) {
        setClearOrSubmit("Clear");
      } else {
        setClearOrSubmit("Submit");
      }
    } else {
      setClearOrSubmit("Submit");
    }
  }, [store.parcelData, store.trackingNumber, trackingNumber]);

  // Handlers
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (clearOrSubmit === "Clear") {
      setTrackingNumber("");
      history.push("/");
    } else {
      history.push(`/?trackingNumber=${trackingNumber}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`Form ${
        store.parcelData.length > 0 && "Form__on-top"
      } bg-gray-100 p-4 border-sm box-border`}
    >
      <fieldset
        disabled={store.isLoading}
        className="flex flex-col align-start"
      >
        <h1
          className={`font-semibold ${
            store.parcelData ? "text-xl" : "text-md"
          }`}
        >
          Parcel Tracker
        </h1>
        <p
          className={`text-sm font-light my-1 ${
            store.parcelData.length && "hidden"
          }`}
        >
          Enter in a tracking number from Canada Post, Purolator, DHL, FedEx,
          SkyNet Worldwide, USPS, or UPS, and see the order history plotted on
          the map!
        </p>
        {process.env.NODE_ENV === "development" && (
          <p className="text-sm font-light mb-2">4337360760364248</p>
        )}
        <label className="flex">
          <input
            id="trackingNumber"
            type="text"
            placeholder="Tracking Number"
            value={trackingNumber || ""}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className={classnames(
              "inline-block w-4/5 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50",
              { "text-red-400": !!store.errorMessage }
            )}
            required
          />
          <button
            className={`inline-block w-1/5 rounded-r-md bg-white hover:bg-gray-300 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${isDanger}`}
            type="submit"
          >
            {clearOrSubmit}
          </button>
        </label>
        {store.errorMessage && (
          <p className="has-text-danger">{store.errorMessage}</p>
        )}
      </fieldset>
    </form>
  );
});
