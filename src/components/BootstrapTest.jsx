import { Button, Toast } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"

const BootstrapTest = () => {
    return (
        <div>
            <button className="btn btn-primary">Azul</button>
            <button className="btn btn-warning">Amarelo</button>
            <Button variant="danger">Vermelho</Button>
            <Toast>
                <Toast.Header>
                    <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
            </Toast>
        </div>
    )
}

export default BootstrapTest