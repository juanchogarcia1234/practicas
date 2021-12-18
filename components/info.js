import React from "react";

const Info = () => {
  return (
    <div className="ui segment" id="info-classes">
      <div className="info-classes-divider">
        <div>
          <i className="check icon green"></i>проведён
        </div>
        <div>
          <i className="check icon grey"></i>не проведён
        </div>
      </div>
      <div className="info-classes-divider">
        <div>
          <i className="share icon blue"></i>перенесён
        </div>
        <div>
          <i className="share icon grey"></i>не перенесён
        </div>
      </div>
      <div className="info-classes-divider">
        <div>
          <i className="times close icon red"></i>отменён
        </div>
        <div>
          <i className="times close icon grey"></i>не отменён
        </div>
      </div>
      <div className="info-classes-divider">
        <div>
          <i className="ruble sign icon yellow"></i>оплачен
        </div>
        <div>
          <i className="ruble sign icon grey"></i>не оплачен
        </div>
      </div>
      <div className="info-classes-divider">
        <div>
          <i className="play circle icon blue"></i>с записью
        </div>
        <div>
          <i className="play circle icon grey"></i>без записи
        </div>
      </div>
    </div>
  );
};

export default Info;
