import React, { useContext } from "react";
import { Context } from "../../../Store/Store";

function FlashMessage() {
  const [state] = useContext(Context);
  const renderMessage = () => {
    if (state.flash_message_show == true) {
      switch (state.data.code) {
        case 400:
          var errorStyle =
            state.data.code == 400 ? { display: "block" } : { display: "none" };
          var html = "";
          var errors = state.data.data;
          for (var key in errors) {
            if (errors.hasOwnProperty(key)) {
              html += "<p>" + errors[key] + "</p>";
            }
          }
          return (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              className="alert alert-danger"
              style={errorStyle}
            ></div>
          );
        case 200:
          var successStyle =
            state.data.code == 200 ? { display: "block" } : { display: "none" };
          return (
            <div className="alert alert-success" style={successStyle}>
              <p className="mb-0"> {state.data.message} </p>
            </div>
          );
        default:
          return "";
      }
    }
    return "";
  };
  return renderMessage();
}
export default React.memo(FlashMessage);
