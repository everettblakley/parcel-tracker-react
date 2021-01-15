import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useStore } from "../../stores/store.context";
import { useQueryParams } from "../../hooks";
import "./Form.scss";

export const Form = observer(function Form() {
  // Hooks
  const history = useHistory();
  const queryParams = useQueryParams();
  const location = useLocation();
  const { store } = useStore();
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
      console.log(store.parcelData);
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
      } has-background-light box`}
    >
      <fieldset
        disabled={store.isLoading}
        className="Form-content content is-small"
      >
        <h1 className={store.parcelData ? "is-size-5" : "is-size-3"}>
          Parcel Tracker
        </h1>
        <p className={`${store.parcelData && "is-hidden"}`}>
          Enter in a tracking number from Canada Post, DHL, FedEx, SkyNet
          Worldwide, USPS, or UPS, and see the order history plotted on the map!
        </p>
        <p>4337360760364248</p>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              id="trackingNumber"
              type="text"
              placeholder="Tracking Number"
              value={trackingNumber || ""}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className={`input is-fullwidth ${isDanger}`}
              required
            />
          </div>
          <div className="control">
            <button className={`button ${isDanger}`} type="submit">
              {clearOrSubmit}
            </button>
          </div>
        </div>
        {store.errorMessage && (
          <p className="has-text-danger">{store.errorMessage}</p>
        )}
      </fieldset>
    </form>
  );
});
