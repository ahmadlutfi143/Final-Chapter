import { Outlet } from "react-router-dom"
import NavbarUser from "./NavbarUser"

function LayoutUser () {
    return (
        <div>
            <div>
              <Outlet />
            </div>
        </div>
    )
}

export default LayoutUser;