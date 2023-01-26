import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import styles from '../styles/modules/modal.module.scss'
import { MdOutlineClose } from 'react-icons/md'
import Button from './Button'
import { addTodo, updateTodo } from '../slices/todoSlice';
import { v4 as uuid } from 'uuid'
import { toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const dropIn = {
    hidden: {
        opacity: 0,
        transform: 'scale(0.9)',
    },
    visible: {
        transform: 'scale(1)',
        opacity: 1,
        transition: {
            duration: 0.1,
            type: 'spring',
            damping: 25,
            stiffness: 500
        },
    },
    exit: {
        transform: 'scale(0.9)',
        opacity: 0
    },
};

//todo inside the props to get the previous todo while updating todo
function TodoModal({ type, modalOpen, setModalOpen, todo }) {

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('incomplete');
    const dispatch = useDispatch();

    useEffect(() => {
        if (type === 'update' && todo) {
            //it sets previous todo on the inputs if the type is input
            setTitle(todo.title);
            setStatus(todo.status);
        } else {
            setTitle('');
            setStatus('Incomplete');
        }
    }, [type, todo, modalOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title === '') {
            toast.error("Please enter a title");
            return;
        }
        if (title && status) {
            if (title === 'add') {
                dispatch(
                    addTodo({
                        id: uuid(),
                        title,
                        status,
                        time: new Date().toLocaleString(),
                    })
                );
                toast.success('Task Added Successfully')
            }
            if (type === 'update') {
                if (todo.title !== title || todo.status !== status) {
                    dispatch(updateTodo({
                        //old todo getting from the props
                        ...todo,
                        title,
                        status
                    }))
                    toast.success('Task Updated Successfully')
                } else {
                    toast.error('No changes made')
                    return;
                }
            }
            setModalOpen(false)
        }
    }

    return (
        <AnimatePresence>
            {/* it checks if modalOpen is euals to true */}
            {modalOpen && (
                <motion.div
                    className={styles.wrapper}
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    exit={{
                        opacity: 0
                    }}
                >
                    <div
                        className={styles.container}
                        variants={dropIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit">
                        <motion.div
                            className={styles.closeButton}
                            onClick={() => setModalOpen(false)}
                            onKeyDown={() => setModalOpen(false)}
                            //whenever you used div as a button,
                            // make sure to add tabIndex={0} and role="button"
                            tabIndex={0}
                            role='button'
                            initial={{
                                top: 40,
                                opacity: 0
                            }}
                            animate={{
                                top: -10,
                                opacity: 1
                            }}
                            exit={{
                                top: 40,
                                opacity: 0
                            }}
                        >
                            <MdOutlineClose></MdOutlineClose>
                        </motion.div>
                        <form className={styles.form}
                            onSubmit={(e) => handleSubmit(e)}>
                            <h1 className={styles.formTitle}>
                                {type === 'update' ? 'Update' : 'Add'} Task
                            </h1>
                            <label htmlFor="title">
                                Title
                                <input type="text"
                                    id='title'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </label>
                            <label htmlFor="status">
                                Status
                                <select name="status"
                                    id="status"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="incomplete">Incomplete</option>
                                    <option value="complete">Complete</option>
                                </select>
                            </label>
                            <div className={styles.buttonContainer}>
                                <Button type="submit" variant="primary" >
                                    {type === 'update' ? 'Update' : 'Add'}
                                    Task</Button>
                                <Button variant="secondary"
                                    onClick={() => setModalOpen(false)}
                                    onKeyDown={() => setModalOpen(false)}
                                >Cancel</Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )
            }
        </AnimatePresence >
    )
}

export default TodoModal