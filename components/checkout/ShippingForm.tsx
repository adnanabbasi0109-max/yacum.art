"use client";

import { useState } from "react";

interface ShippingAddress {
  name: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingFormProps {
  onSubmit: (address: ShippingAddress) => void;
}

const shippingZones = [
  { countries: ["IN"], price: 9900, label: "India — ₹99 (3-5 days)" },
  {
    countries: ["AE", "SA", "QA", "KW", "BH", "OM"],
    price: 49900,
    label: "GCC — ₹499 (7-12 days)",
  },
  { countries: ["US", "CA"], price: 79900, label: "North America — ₹799 (10-14 days)" },
  { countries: ["GB"], price: 69900, label: "UK — ₹699 (10-14 days)" },
];

export function getShippingCost(country: string): number {
  for (const zone of shippingZones) {
    if (zone.countries.includes(country)) return zone.price;
  }
  return 99900; // Rest of World (₹999)
}

export default function ShippingForm({ onSubmit }: ShippingFormProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "IN",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address);
  };

  const inputClass =
    "w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-text-primary font-[family-name:var(--font-display)] text-lg mb-4">
        Shipping Address
      </h3>

      <input
        name="name"
        placeholder="Full Name"
        value={address.name}
        onChange={handleChange}
        required
        className={inputClass}
      />

      <input
        name="line1"
        placeholder="Address Line 1"
        value={address.line1}
        onChange={handleChange}
        required
        className={inputClass}
      />

      <input
        name="line2"
        placeholder="Address Line 2 (optional)"
        value={address.line2}
        onChange={handleChange}
        className={inputClass}
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          name="postalCode"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <select
          name="country"
          value={address.country}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="IN">India</option>
          <option value="AE">UAE</option>
          <option value="SA">Saudi Arabia</option>
          <option value="QA">Qatar</option>
          <option value="KW">Kuwait</option>
          <option value="BH">Bahrain</option>
          <option value="OM">Oman</option>
          <option value="GB">United Kingdom</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      <div className="bg-bg-secondary border border-border-subtle p-4">
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
          Estimated Shipping
        </p>
        <p className="text-gold font-[family-name:var(--font-mono)]">
          ₹{(getShippingCost(address.country) / 100).toFixed(0)}
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
      >
        Continue to Payment
      </button>
    </form>
  );
}
