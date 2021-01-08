import { autorun, computed } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { useStore } from "../../stores/store.context";
import "./Form.scss";

export const Form = observer(() => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isDanger, setIsDanger] = useState("");
  const { store } = useStore();

  useEffect(() => {
    const dispose = autorun(() => {
      if (store.errorMessage) {
        setIsDanger("is-danger");
      } else {
        setIsDanger("");
      }
    });
    return () => dispose();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    store.load(trackingNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="Form has-background-light">
      <fieldset
        disabled={store.isLoading}
        className="Form-content content is-small"
      >
        <h1>Parcel Tracker</h1>
        <p>
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
            />
          </div>
          <div className="control">
            <button className={`button ${isDanger}`} type="submit">
              Submit
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
