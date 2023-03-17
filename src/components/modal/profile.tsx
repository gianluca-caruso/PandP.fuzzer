import { ProfileCtx } from "@/context/user/profile";
import useEditProfile from "@/hook/user/edit";
import { FC, useContext } from "react";
import Modal from ".";
import Input from "../input/group";

export interface IModalProfile {}


const ModalProfile: FC<IModalProfile> = ({ }) => {

    const { isOpen, set } = useContext(ProfileCtx);

    const { register, handleForm, status, onDeleteUser } = useEditProfile();

    if (status === "error" || status === "loading") {
        return <></>
    }

    return (
        <>
            <Modal id="modal-profile" {...{ isOpen, set }}>
                <Modal.Title>Profile</Modal.Title>
                <Modal.Body>
                    <form onSubmit={handleForm} className="form-control gap-2">
                        <Input type={"text"} title="username" {...register("name", { min: 1 })} />
                        <Input type={"email"} title="email" {...register("email")} />
                        <Input type={"password"} title="new password" {...register("password")} />
                        <Input type={"password"} title="confirm password" {...register("confirmPassword")} />
                        <div className="divider"></div>
                        <Input type={"password"} title="password" {...register("pass")} />
                        <button className="btn btn-primary" type="submit">save</button>
                    </form>
                    <button className="btn btn-error" onClick={onDeleteUser} >delete account</button>
                </Modal.Body>
                <Modal.Actions>
                </Modal.Actions>
            </Modal>
        </>
    );
};

export default ModalProfile;