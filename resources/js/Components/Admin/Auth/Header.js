import React from "react";

function Header() {
  return (
    <div className="misc-header text-center">
      <img
        style={{ width: "165px" }}
        alt="logo"
        src="/images/logo.png"
        className="toggle-none hidden-xs"
      />
    </div>
  );
}
export default React.memo(Header)
