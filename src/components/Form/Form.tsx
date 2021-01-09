import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStore } from "../../stores/store.context";
import "./Form.scss";

export const Form = observer(function Form() {
  const [trackingNumber, setTrackingNumber] = useState("4337360760364248");
  const [isDanger, setIsDanger] = useState("");
  const { store } = useStore();

  useEffect(() => {
    if (!!store.errorMessage) {
      setIsDanger("is-danger");
    } else {
      setIsDanger("");
    }
  }, [store.errorMessage]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (store.data) {
      store.clear();
    } else {
      store.load(trackingNumber);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`Form ${
        store.data && "Form__on-top"
      } has-background-light box`}
    >
      <fieldset
        disabled={store.isLoading}
        className="Form-content content is-small"
      >
        <h1 className={store.data ? "is-size-5" : "is-size-3"}>
          Parcel Tracker
        </h1>
        <p className={`${store.data && "is-hidden"}`}>
          Enter in a tracking number from Canada Post, DHL, FedEx, SkyNet
          Worldwide, USPS, or UPS, and see the order history plotted on the map!
        </p>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              id="trackingNumber"
              type="text"
              placeholder="Tracking Number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className={`input is-fullwidth ${isDanger}`}
              required
            />
          </div>
          <div className="control">
            <button className={`button ${isDanger}`} type="submit">
              {!!store.data ? "Clear" : "Submit"}
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
