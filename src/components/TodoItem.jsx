import React, {Component} from "react";
import PropTypes from 'prop-types';

const propTypes = {
    todo: PropTypes.object.isRequired,
    isFocused: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
};

class TodoItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editTitle: this.props.todo.title,
        };

        this.ESCAPE_KEY = 27;
        this.ENTER_KEY = 13;
        this.node = null;
    }

    componentDidUpdate() {
        if (!this.props.isFocused) { //blur input if editing is done
            this.node.blur()
        }
    }

    handleFocus() {
        this.props.edit(this.props.todo)
    }

    handleChange(e) {
        this.setState({editTitle: e.target.value})
    }

    handleKeyDown(e) {
        if (e.keyCode === this.ESCAPE_KEY) {

            //if Ecs was pressed reset editTitle value to original
            this.setState({editTitle: this.props.todo.title});
            this.props.cancel();

        } else if (e.keyCode === this.ENTER_KEY) {

            this.handleSubmit();
        }
    }

    handleSubmit() {
        if (this.props.isFocused) {

            //check if entered title is valid
            const title = this.state.editTitle.trim();

            if (title) {
                this.props.save(title);
                this.setState({editTitle: title}); //update title

            } else {
                //remove to do item if title is empty
                this.props.remove(this.props.todo.id);
            }
        }

    }

    render() {
        const { todo } = this.props;

        return (
            <li className={"row"}>
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <div className="input-group-text">
                            <input
                                type="checkbox"
                                checked={todo.done}
                                onChange={()=> this.props.toggle(todo.id)}
                            />
                        </div>
                    </div>
                    <input
                        ref={node => this.node = node}
                        type="text"
                        className={"form-control " + (todo.done ? "done" : "")}
                        placeholder={"What do you need to do?"}
                        value={this.state.editTitle}
                        onFocus={() => this.handleFocus()}
                        onChange={(e) => this.handleChange(e)}
                        onBlur={() => this.handleSubmit()}
                        onKeyDown={(e) => this.handleKeyDown(e)}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-outline-light btn--remove btn--action"
                    onClick={() => this.props.remove(todo.id)}
                />
            </li>
        )
    }
}

TodoItem.propTypes = propTypes;

export default TodoItem