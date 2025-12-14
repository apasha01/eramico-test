import { Button } from "@mui/material"
import React from 'react'
import FilterIcon from "../Icons/FilterIcon"

function FilterButton() {
  return (
    <div>
      <div className=" rtl">
          <Button>
            <FilterIcon />
            فیلتر
          </Button>
        </div>
    </div>
  )
}

export default FilterButton
