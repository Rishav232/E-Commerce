import React from 'react'

const CategoryForm = ({name,handleSubmit,setName}) => {
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input type="text" className="form-control" style={{width:"300px"}} 
                    placeholder='Create Category' value={name} onChange={(e)=>{setName(e.target.value)}}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </>
    )
}

export default CategoryForm