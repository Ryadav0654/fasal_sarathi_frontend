

const Button = ({ className, onClickHandler, btnname, ...props }) => {

  return (
    <>
      <button className={` ${className}`} onClick={onClickHandler} {...props}>{btnname}</button>
    </>
  )
}

export default Button