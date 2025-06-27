import React from 'react';

function Footer()
{
   return(
    <div className="text-center misc-footer">
        <p>Copyright &copy; { window.moment().format('YYYY') } Adonis</p>
    </div>
   );
}
export default React.memo(Footer)
