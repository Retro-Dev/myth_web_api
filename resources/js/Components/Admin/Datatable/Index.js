import React, { useState } from 'react'
import Helper from '../../../Helper'

function Index(props)
{
    const renderColumnData = (column,record) => {
        if( column.type == 'checkbox' ){
          return checkBoxColumn(column,record)
        } else if( column.type == 'action' ){
          return renderActionColumn(column,record)
        } else if( column.type == 'timestamp' ){
          return renderTimeStampColumn(column,record)
        } else if( column.type == 'callback' ){
          return rendercallbackColumn(column,record)
        } else {
          return textColumn(column,record)
        }
    }

    const rendercallbackColumn = (column,record) => {
      return(
        <td key={ record.id + column.key }>{ column.cb(record) }</td>
      )
    }

    const checkBoxColumn = (column,record) => {
        return(
          <td key={ record.id + column.key }><input onChange={ () => {} } type='checkbox' className='slug' name='slug[]' value={ record[column.key] } /></td>
        )
    }

    const textColumn = (column,record) => {
       return(
         <td key={ record.id + column.key }>{ record[column.key] }</td>
       )
    }

    const renderTimeStampColumn = (column,record) => {
        return(
          <td key={ record.id + column.key }>{ window.moment(record[column.key]).local().format('MM-DD-YYYY hh:mm A') }</td>
        )
    }

    const renderActionColumn = ( column,record ) => {
      return(
        <td key={ record.id + column.key }>{ column.action_cb(record) }</td>
      )
    }

    const checkedAll = (e) => {
      var inputs = document.querySelectorAll('.slug');
      if( e.target.checked ){
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = true;
        }
      } else {
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].checked = false;
        }
      }

    }

    const bulkDelete = (e) => {
        let slugs = []
        e.preventDefault();
        let getCheckbox = document.querySelectorAll('input[name="slug[]"]:checked');
        if( getCheckbox.length > 0 ){
            Helper.sweetConfirmationModal('Are you sure you want to continue?',function(){
                for( var i=0; i < getCheckbox.length; i++ ){
                    slugs.push(getCheckbox[i].value);
                }
                props.config.bulk_delete_cb(slugs);
            })
        } else {
          Helper.sweetAlert('info','Info','Please select a record');
        }
    }

    const filterFormSubmit = (e) => {
        e.preventDefault();
        if( e.target.keyword.value != '' && e.target.keyword.value != null ){
            props.config.filter_cb(e.target.keyword.value)
        }
    }

    return(
      <>
        <table className="table">
            <thead>
                <tr key='column_row'>
                    {
                        props.columns.map( (column) => {
                            return(
                              <th key={column.title}>
                                {  column.type == 'checkbox' ? <input value='1' type="checkbox" onChange={ checkedAll } /> : column.title }
                              </th>
                            )
                        })
                    }
                </tr>
                {
                    props.config.bulk_delete || props.config.search ?
                      <tr key='filter_row' className="table-primary">
                        <th key="filtersection" colSpan={props.columns.length}>
                            <div className="row">
                                <div className="col-md-6">
                                  {
                                      props.config.bulk_delete ?
                                        <a to='javascript:void(0)' onClick={ bulkDelete } className="btn btn-default btn-xs bulk_delete">Bulk Delete</a>
                                      : null
                                  }
                                </div>
                                <div className="col-md-2"></div>
                                <div className="col-md-4 pull-right">
                                    {
                                        props.config.search ?
                                          <form onSubmit={ filterFormSubmit }>
                                            <div className="input-group">
                                                <input type="text" name="keyword" className="form-control" placeholder="Search" />
                                                <span className="input-group-btn">
                                                    <button className="btn btn-default">
                                                        <i className="fa fa-search" aria-hidden="true"></i>
                                                    </button>
                                                </span>
                                            </div>
                                          </form>
                                        : null
                                    }
                                </div>
                            </div>
                        </th>
                      </tr>
                    : null
                }
            </thead>
            <tbody>
               {
                  props.data.length > 0 ?
                    props.data.map( (record) => {
                        return <tr key={ record.id }>
                                  {
                                    props.columns.map( (column) => {
                                        return renderColumnData(column,record)
                                    })
                                  }
                               </tr>
                    })
                  : <tr><td colSpan={props.columns.length}>No Data Found</td></tr>
               }
            </tbody>
        </table>
      </>
    )
}
export default React.memo(Index)

