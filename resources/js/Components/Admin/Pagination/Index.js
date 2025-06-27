import React from 'react';
import ReactPaginate from 'react-paginate';

function Index(props)
{
    const handlePageChange = (event) => {
        props.callback( event.selected + 1 );
    }
    return(
      <>
          {
              !window._.isEmpty(props.paginationData) ?
                <ReactPaginate
                    previousLabel="Previous"
                    nextLabel="Next"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageCount={props.paginationData.total}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageChange}
                    containerClassName="pagination"
                    activeClassName="active"
                />
              : null
          }
      </>
    );
}
export default React.memo(Index)
