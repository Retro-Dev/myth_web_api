import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'rsuite';

function Alert(props)
{
    return(
      <>
        <Modal backdrop="static" role="alertdialog" open={props.isShow}  size="xs">
            <Modal.Body>
                { props.message }
            </Modal.Body>
            <Modal.Footer>
              {
                  props.type == 'confirm' ?
                    <Button onClick={props.callback} appearance="primary">
                      Ok
                    </Button>
                  : null
              }
              <Button onClick={props.modalClose} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
      </>
    )
}
export default React.memo(Alert)

