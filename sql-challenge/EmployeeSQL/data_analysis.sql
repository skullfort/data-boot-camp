-- 1. List the employee number, last name, first name, sex, and salary of each employee
SELECT e.emp_no, e.last_name, e.first_name, e.sex, s.salary
FROM employees e
INNER JOIN salaries s ON
e.emp_no = s.emp_no;

-- 2. List the first name, last name, and hire date for the employees who were hired in 1986
SELECT first_name, last_name, hire_date
FROM employees
WHERE EXTRACT(YEAR FROM hire_date) = 1986;

-- 3. List the manager of each department along with their department number, department name, employee number, last name, and first name
SELECT d_m.dept_no, d.dept_name, d_m.emp_no, e.last_name, e.first_name
FROM dept_manager d_m
INNER JOIN departments d ON
d_m.dept_no = d.dept_no
INNER JOIN employees e ON
d_m.emp_no = e.emp_no;

-- 4. List the department number for each employee along with that employee's employee number, last name, first name, and department name
SELECT d_e.dept_no, d_e.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp d_e
INNER JOIN departments d ON
d_e.dept_no = d.dept_no
INNER JOIN employees e ON
d_e.emp_no = e.emp_no;

-- 5. List first name, last name, and sex of each employee whose first name is Hercules and whose last name begins with the letter B
SELECT first_name, last_name, sex
FROM employees
WHERE first_name = 'Hercules' AND last_name LIKE 'B%';

-- 6. List each employee in the Sales department, including their employee number, last name, and first name
SELECT emp_no, last_name, first_name
FROM employees
WHERE emp_no IN
(
    SELECT emp_no
    FROM dept_emp
    WHERE dept_no IN
    (
        SELECT dept_no
        FROM departments
        WHERE dept_name = 'Sales'
    )
);

-- 7. List each employee in the Sales and Development departments, including their employee number, last name, first name, and department name
SELECT d_e.emp_no, e.last_name, e.first_name, d.dept_name
FROM dept_emp d_e
INNER JOIN 
	(SELECT dept_no, dept_name
	 FROM departments
	 WHERE dept_name in ('Sales', 'Development')) d
ON d_e.dept_no = d.dept_no
INNER JOIN employees e ON
d_e.emp_no = e.emp_no;

-- 8. List the frequency counts, in descending order, of all the employee last names (that is, how many employees share each last name)
SELECT last_name, COUNT(last_name) count_last_name
FROM employees
GROUP BY last_name
ORDER BY count_last_name DESC;