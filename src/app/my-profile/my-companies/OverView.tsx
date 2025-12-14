import React from "react";
import AboutCompany from "./@componenets/AboutCompany";
import OverViewPostList from "./@componenets/OverViewPostList";
import Media from "./@componenets/media";


interface OverViewProps {
  onSelect: any;
  props: any;
}


const OverView = ({ onSelect, props }: OverViewProps) => {

 
  return (
    <div className="mainStyle">
 
      <AboutCompany
        shortIntroduction={props.shortIntroduction}
        webpage={props.webpage}
        telephone={props.telephone}
        address={props.address}
      />
      <Media onSelect={onSelect} id={props.id} />
      <OverViewPostList id={props.id} />
    </div>
  );
};
export default OverView;
