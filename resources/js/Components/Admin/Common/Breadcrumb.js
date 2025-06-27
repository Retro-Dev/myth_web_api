import React from 'react';

function Breadcrumb(props)
{
    return(
       <>
        <div className="page-header">
          <div className="col-lg-6 align-self-center ">
            <h2>{ props.page_title }</h2>
          </div>
        </div>
       </>
    )
}
export default React.memo(Breadcrumb)
