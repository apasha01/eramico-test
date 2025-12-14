"use client";
import React from "react";
import AboutCompany from "./@componenets/AboutCompany";
import Media from "./@componenets/media";
import CompanyUserList from "./@componenets/company-user-list";
import { CompanyUserInterface } from "./@componenets/CompanyUserInterface";

interface OverViewProps {
  onSelect: any;
  props: any;
  users: CompanyUserInterface[];
}

const OverView = ({ onSelect, props, users }: OverViewProps) => {
  return (
    <div className="mainStyle">
      <AboutCompany
        shortIntroduction={props.shortIntroduction}
        webpage={props.webpage}
        telephone={props.telephone}
        address={props.address}
      />
      {users && users.length > 0 && <CompanyUserList users={users} />}
      <Media onSelect={onSelect} id={props.id} />
    </div>
  );
};
export default OverView;
