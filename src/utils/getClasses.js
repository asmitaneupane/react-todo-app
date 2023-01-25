export const getClasses = (classes) => {
    //get all the classes and return it
    return classes
    //filter from all the classes if it is empty
    .filter((item) => item !== '')
    //join all classes with the space between them
    .join(' ')
    //trim/remove the space from the starting and the end
    .trim()
}